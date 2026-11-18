import '@milkdown/prose/view/style/prosemirror.css';

import { $prose, getMarkdown } from '@milkdown/utils';
import { AllSelection, Command, EditorState, Plugin, TextSelection, Transaction } from '@milkdown/prose/state';
import { Attrs, Mark, MarkType, Node, NodeRange, NodeType, Slice } from '@milkdown/prose/model';
import {
  Editor,
  defaultValueCtx,
  editorStateOptionsCtx,
  editorViewCtx,
  parserCtx,
  remarkStringifyOptionsCtx,
  rootCtx,
} from '@milkdown/core';
import { Transform, findWrapping, liftTarget } from '@milkdown/prose/transform';
import {
  commonmark,
  inputRules as commonmarkInputRules,
  keymap as commonmarkKeymap,
  markInputRules as commonmarkMarkInputRules,
  emphasisKeymap,
  inlineCodeSchema,
  linkSchema,
  listItemKeymap,
  remarkPreserveEmptyLinePlugin,
  strongKeymap,
  syncHeadingIdPlugin,
  syncListOrderPlugin,
  wrapInBulletListInputRule,
  wrapInOrderedListInputRule,
} from '@milkdown/preset-commonmark';
import {
  extendListItemSchemaForTask,
  gfm,
  inputRules as gfmInputRules,
  markInputRules as gfmMarkInputRules,
} from '@milkdown/preset-gfm';
import { findParentNodeClosestToPos, getMarkRange } from '@milkdown/prose';
import { liftListItem, wrapInList } from '@milkdown/prose/schema-list';
import { redo, redoDepth, undo, undoDepth } from '@milkdown/prose/history';
import { splitBlock, toggleMark } from '@milkdown/prose/commands';

import { Unsafe, defaultHandlers } from 'mdast-util-to-markdown';
import { clipboard } from '@milkdown/plugin-clipboard';
import { history } from '@milkdown/plugin-history';
import { trailing, trailingConfig } from '@milkdown/plugin-trailing';
import { keymap } from '@milkdown/prose/keymap';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export type MarkdownAction =
  'bold' | 'italic' | 'strikethrough' | 'code' | 'bulletList' | 'orderedList' | 'quote' | 'undo' | 'redo';

// The buttons of the toolbar: the actions, and the link button, which opens the link box.
export type MarkdownButton = MarkdownAction | 'link';

/** What the toolbar shows for the text at the cursor. */
export interface MarkdownToolbarState {
  // Whether each formatting button is on. Undo and Redo have no on state.
  pressed: Partial<Record<MarkdownButton, boolean>>;
  // Whether Undo and Redo have something to do.
  enabled: Partial<Record<MarkdownButton, boolean>>;
  // 0 for text, the level of a heading, or null where the lines cannot be headings, like in a code block.
  lineStyle: number | null;
  // The address of the link at the cursor, or ''.
  link: string;
}

export interface MarkdownEditor {
  run: (action: MarkdownAction) => void;
  // 0 makes the lines text, 1 to 3 headings of that level.
  setLineStyle: (level: number) => void;
  // An empty address removes the link.
  setLink: (href: string) => void;
  setProps: (isEditable: boolean, attributes: Record<string, string>) => void;
  focus: () => void;
  destroy: () => void;
}

interface MarkdownEditorOptions {
  value: string;
  onChange: (markdown: string) => void;
  onStateChange: (state: MarkdownToolbarState) => void;
  onLinkShortcut: () => void;
}

// Remark-gfm escapes the "@" of an email address, and the "." and ":" of "www." and "://", so they would not become
// links. MarkdownText makes links of them anyway, and the backslashes would show in the CSV export and in Slack.
const AUTOLINK_GUARDS = ['@[+\\-.\\w]', '.[Ww]', ':[ps]'];

// The note as MarkdownText reads it: its syntax tree, without the positions in the text.
const reader = unified().use(remarkParse).use(remarkGfm).use(remarkBreaks);
const readTree = (markdown: string) =>
  JSON.stringify(reader.runSync(reader.parse(markdown)), (key, value) => (key === 'position' ? undefined : value));

// In the editor a line is a paragraph, and an empty paragraph is the empty line between two paragraphs of Markdown,
// so Enter makes a new line as in a text box.
const linesAsParagraphs = (doc: Node) => {
  const { paragraph, hardbreak } = doc.type.schema.nodes;
  const tr = new Transform(doc);
  doc.descendants((node, pos, parent, index) => {
    // Where the node is now, after the changes before it.
    const at = tr.mapping.map(pos);
    if (node.type === paragraph && index > 0 && parent?.child(index - 1).type === paragraph) {
      tr.insert(at, paragraph.create());
    } else if (node.type === hardbreak && parent?.type === paragraph) {
      tr.delete(at, at + 1).split(at);
    }
  });
  return tr.doc;
};

// A code block, table or rule at the end gets an empty line after it, which the cursor could not otherwise get past.
const needsLineAfter = (last: Node | null) => ['code_block', 'table', 'hr'].includes(last?.type.name ?? '');

// Pasted code stays a code block: opened at an edge of the paste, its lines would join the line at the cursor.
const closeCode = ({ content, openStart, openEnd }: Slice) =>
  new Slice(
    content,
    content.firstChild?.type.spec.code ? 0 : openStart,
    content.lastChild?.type.spec.code ? 0 : openEnd
  );

// Puts white space that Markdown dropped from pasted text back at pos, when pos is in a line of text: its spaces as
// text with the formatting of the paste, its new lines as new lines.
const insertWhiteSpace = (tr: Transaction, pos: number, whiteSpace: string, marks: readonly Mark[]) => {
  if (tr.doc.resolve(pos).parent.type.name !== 'paragraph') {
    return;
  }
  const lines = whiteSpace.split('\r').join('').split('\n');
  // From the last line back, as each goes in at pos, before the ones after it.
  for (let index = lines.length - 1; index >= 0; index--) {
    if (lines[index]) {
      tr.insert(pos, tr.doc.type.schema.text(lines[index], marks));
    }
    if (index > 0) {
      tr.split(pos);
    }
  }
};

// Whether the note has text, a picture, a rule or HTML, and not only formatting, like an empty heading or bullet.
const hasContent = (doc: Node) =>
  doc.textBetween(0, doc.content.size, '', (leaf) => (leaf.type.name === 'hardbreak' ? '' : 'x')).trim() !== '';

const isInCode = (state: EditorState) => !!state.selection.$from.parent.type.spec.code;

// The link at the cursor, or at the start of the selection, and the range of its text.
const linkAt = (state: EditorState) => {
  const { $from, from, empty } = state.selection;
  const { link } = state.schema.marks;
  // Not at the edge of a link, where typing does not extend it.
  return link.isInSet(empty ? $from.marks() : (state.doc.nodeAt(from)?.marks ?? [])) ? getMarkRange($from, link) : null;
};

// Makes the lines of text and headings in the selection one style. A code block keeps its lines, and an empty line
// keeps its style unless it is the one the cursor is on.
const styleLines =
  (type: NodeType, attrs?: Attrs): Command =>
  (state, dispatch) => {
    const { from, to, empty } = state.selection;
    const tr = state.tr;
    state.doc.nodesBetween(from, to, (node, pos, parent, index) => {
      const isLine = node.type.name === 'paragraph' || node.type.name === 'heading';
      if (
        isLine &&
        (empty || node.content.size) &&
        !node.hasMarkup(type, attrs) &&
        parent?.canReplaceWith(index, index + 1, type)
      ) {
        tr.setNodeMarkup(pos, type, attrs);
      }
    });
    if (tr.docChanged) {
      dispatch?.(tr.scrollIntoView());
    }
    return tr.docChanged;
  };

const toolbarState = (state: EditorState): MarkdownToolbarState => {
  const { schema, selection, storedMarks, doc } = state;
  const { $from, from, to, empty } = selection;
  const hasMark = (type: MarkType) =>
    empty ? !!type.isInSet(storedMarks ?? $from.marks()) : doc.rangeHasMark(from, to, type);
  // The innermost list decides which list button is on.
  const list = findParentNodeClosestToPos((node) => node.type.name.endsWith('_list'))($from)?.node.type.name;
  const isInQuote = !!findParentNodeClosestToPos((node) => node.type === schema.nodes.blockquote)($from);
  const canBeHeading = styleLines(schema.nodes.heading, { level: 1 })(state);
  const link = linkAt(state);
  return {
    pressed: {
      bold: hasMark(schema.marks.strong),
      italic: hasMark(schema.marks.emphasis),
      strikethrough: hasMark(schema.marks.strike_through),
      code: isInCode(state) || hasMark(schema.marks.inlineCode),
      bulletList: list === 'bullet_list',
      orderedList: list === 'ordered_list',
      quote: isInQuote,
      link: !!link,
    },
    enabled: { undo: undoDepth(state) > 0, redo: redoDepth(state) > 0 },
    lineStyle: $from.parent.type.name === 'heading' ? ($from.parent.attrs.level as number) : canBeHeading ? 0 : null,
    link: link?.mark.attrs.href ?? '',
  };
};

// Takes the lines out of a list of this kind, makes a list of the other kind this kind, or makes a list of the lines.
const toggleList =
  (type: NodeType, other: NodeType): Command =>
  (state, dispatch) => {
    const list = findParentNodeClosestToPos((node) => node.type === type || node.type === other)(state.selection.$from);
    if (list?.node.type === other) {
      dispatch?.(state.tr.setNodeMarkup(list.pos, type, { spread: list.node.attrs.spread }));
      return true;
    }
    return (list ? liftListItem(state.schema.nodes.list_item) : wrapInList(type))(state, dispatch);
  };

// Takes the lines out of the quote the cursor is in, or puts the selected lines in a quote.
const toggleQuote: Command = (state, dispatch) => {
  const { $from, $to } = state.selection;
  const { blockquote } = state.schema.nodes;
  const quote = findParentNodeClosestToPos((node) => node.type === blockquote)($from);
  if (quote) {
    // Only the lines in that quote, as the pressed button shows, also when the selection goes on after it.
    const $end = state.doc.resolve(Math.min($to.pos, quote.start + quote.node.content.size));
    const range = $from.blockRange($end, (node) => node.type === blockquote);
    const target = range && liftTarget(range);
    if (range && typeof target === 'number') {
      dispatch?.(state.tr.lift(range, target).scrollIntoView());
    }
    return true;
  }
  // A quote cannot go in a list, so lines of a list are quoted with their list.
  for (
    let range = $from.blockRange($to);
    range;
    range = range.depth ? new NodeRange($from, $to, range.depth - 1) : null
  ) {
    const wrapping = findWrapping(range, blockquote);
    if (wrapping) {
      dispatch?.(state.tr.wrap(range, wrapping).scrollIntoView());
      return true;
    }
  }
  return false;
};

// Inline code within a line, a code block for whole lines, and lines again for a code block.
const toggleCode: Command = (state, dispatch) => {
  const { schema, doc } = state;
  const { $from, $to } = state.selection;
  const { code_block: codeBlock, paragraph } = schema.nodes;
  if ($from.parent.type === codeBlock) {
    const lines = $from.parent.textContent
      .split('\n')
      .map((line) => paragraph.create(null, line ? schema.text(line) : null));
    dispatch?.(state.tr.replaceWith($from.before(), $from.after(), lines).scrollIntoView());
    return true;
  }
  const isLine = $from.sameParent($to);
  const range = $from.blockRange($to)!;
  // Code holds plain text: a picture or a piece of HTML in it would be lost, and so would a list or table it reached.
  let isPlainText = isLine || range.parent.canReplaceWith(range.startIndex, range.endIndex, codeBlock);
  doc.nodesBetween(isLine ? $from.pos : range.start, isLine ? $to.pos : range.end, (node, _pos, parent) => {
    if (parent === range.parent ? !node.isTextblock : node.isInline && !node.isText && node.type.name !== 'hardbreak') {
      isPlainText = false;
    }
  });
  if (!isPlainText) {
    return false;
  }
  if (isLine) {
    return toggleMark(schema.marks.inlineCode)(state, dispatch);
  }
  const text = doc.textBetween(range.start, range.end, '\n');
  dispatch?.(state.tr.replaceWith(range.start, range.end, codeBlock.create(null, text ? schema.text(text) : null)));
  return true;
};

// Takes nested list items one level up, but never a bullet out of its list, so Shift+Tab can still leave the field.
const liftNestedListItem: Command = (state, dispatch) => {
  const { $from, $to } = state.selection;
  const item = state.schema.nodes.list_item;
  // The items liftListItem lifts, which are nested when another list item holds their list.
  const range = $from.blockRange($to, (node) => node.firstChild?.type === item);
  return !!range && $from.node(range.depth - 1).type === item && liftListItem(item)(state, dispatch);
};

// Left out of Milkdown's presets.
const LEFT_OUT: unknown[] = [
  // Saves an empty line as "<br />".
  remarkPreserveEmptyLinePlugin,
  // Change the document as it opens, and the list order one can throw (Milkdown issue 2505).
  syncHeadingIdPlugin,
  syncListOrderPlugin,
  // Typing symbols formats nothing: "~5 weeks, ~3 days" would be struck through and lose its tildes. The list rules
  // are added back below.
  commonmarkInputRules,
  commonmarkMarkInputRules,
  gfmInputRules,
  gfmMarkInputRules,
  // Shortcuts that skip the toolbar's commands: Ctrl+E would drop links, Ctrl+Alt+0 join the lines of a code block.
  // The list, bold and italic ones are added back below.
  commonmarkKeymap,
].flat();

const presets = [...commonmark, ...gfm].filter((plugin) => !LEFT_OUT.includes(plugin));

// A list item made in the editor is compact: no empty line before the list in it.
const listItem = extendListItemSchemaForTask.extendSchema((prev) => (ctx) => {
  const schema = prev(ctx);
  return { ...schema, attrs: { ...schema.attrs, spread: { default: false, validate: 'boolean' } } };
});

// Text typed after a link is not part of it. A link goes inside bold or strike-through, as remark reads "~~https://…~~",
// so that a struck web address opens in the editor again.
const link = linkSchema.extendSchema((prev) => (ctx) => ({ ...prev(ctx), inclusive: false, priority: 60 }));

// Text typed after code is code, as it is bold after bold, until the Code button is pressed again. Milkdown's ends the
// code, so that after pressing Code only the first letter typed would be code.
const inlineCode = inlineCodeSchema.extendSchema((prev) => (ctx) => ({ ...prev(ctx), inclusive: true }));

// Pasted plain text is read as Markdown, as the notes are, with its lines as lines of the editor.
const pasteText = $prose(
  (ctx) =>
    new Plugin({
      props: {
        // A picture cannot be kept in a note, so it is pasted as its alt text, like an emoji Gmail shows as a picture.
        // A non-breaking space next to bold would be saved as "&#xA0;".
        transformPastedHTML: (html) =>
          html.replace(/<img[^>]*>/gi, (img) => img.match(/\salt="([^"]*)"/)?.[1] ?? '').replace(/&nbsp;|\u00a0/g, ' '),
        transformPasted: closeCode,
        handlePaste: (view, event) => {
          const text = event.clipboardData?.getData('text/plain');
          if (!text || event.clipboardData?.getData('text/html') || isInCode(view.state)) {
            return false;
          }
          const { selection, storedMarks } = view.state;
          // The text takes the formatting at the cursor, as typed text does.
          const marks = storedMarks ?? selection.$from.marks();
          const doc = linesAsParagraphs(ctx.get(parserCtx)(text));
          const tr = view.state.tr.replaceSelection(closeCode(Slice.maxOpen(doc.content)));
          const start = tr.mapping.map(selection.from, -1);
          const end = tr.selection.from;
          marks.forEach((mark) => tr.addMark(start, end, mark));
          // Markdown drops the white space at the edges of the text, which would glue it to the text around it. A code
          // block, list or other block at an edge is a line of its own.
          const textEnd = text.trimEnd().length;
          if (doc.lastChild?.type.name === 'paragraph') {
            insertWhiteSpace(tr, end, text.slice(textEnd), marks);
          }
          if (doc.firstChild?.type.name === 'paragraph') {
            insertWhiteSpace(tr, start, text.slice(0, Math.min(text.length - text.trimStart().length, textEnd)), marks);
          }
          view.dispatch(tr.scrollIntoView());
          return true;
        },
      },
    })
);

/** Makes root a rich text editor of the Markdown value, or resolves to null for a note it would change the meaning of. */
export const createMarkdownEditor = async (
  root: HTMLElement,
  options: MarkdownEditorOptions
): Promise<MarkdownEditor | null> => {
  // What the note reads as once it is loaded, and null until then, so that loading it is no change.
  let baseline: string | null = null;
  // The note as Markdown, without the new lines around it. Not trim(), which would drop a non-breaking space too.
  const markdown = () => editor.action(getMarkdown()).replace(/^\n+|\n+$/g, '');

  const shortcuts = $prose(() =>
    keymap({
      // A new line as Enter makes, also in a list item, where Enter makes a new item.
      'Shift-Enter': (state, dispatch) => !isInCode(state) && splitBlock(state, dispatch),
      'Shift-Tab': liftNestedListItem,
      'Mod-k': () => {
        options.onLinkShortcut();
        return true;
      },
    })
  );

  // Tells about each change as it happens. A note that reads as it did when it opened keeps its own text, byte for byte.
  const changes = $prose(
    () =>
      new Plugin({
        view: () => ({
          update: (view, previousState) => {
            options.onStateChange(toolbarState(view.state));
            if (baseline === null || view.state.doc.eq(previousState.doc)) {
              return;
            }
            // Formatting without text is an empty note, as the required checks expect.
            const note = hasContent(view.state.doc) ? markdown() : '';
            options.onChange(note === baseline ? options.value : note);
          },
        }),
      })
  );

  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, options.value);
      ctx.set(editorStateOptionsCtx, (stateOptions) => {
        const doc = linesAsParagraphs(stateOptions.doc!);
        const lastLine = doc.type.schema.nodes.paragraph.create();
        return { ...stateOptions, doc: needsLineAfter(doc.lastChild) ? doc.copy(doc.content.addToEnd(lastLine)) : doc };
      });
      ctx.update(trailingConfig.key, (config) => ({ ...config, shouldAppend: needsLineAfter }));
      ctx.set(remarkStringifyOptionsCtx, {
        rule: '-',
        // Bullets keep the marker the note is written with, "-", "*" or "+".
        bullet: (options.value.match(/^[ \t>]*([-*+])[ \t]/m)?.[1] ?? '-') as '-' | '*' | '+',
        // Two lines are a new line apart. The empty paragraph between two paragraphs makes the empty line.
        join: [(left, right) => (left.type === 'paragraph' && right.type === 'paragraph' ? 0 : undefined)],
        handlers: {
          root: (node, parent, state, info) => {
            state.unsafe = state.unsafe
              .filter((pattern) => !AUTOLINK_GUARDS.includes(pattern.character + pattern.before))
              // An "&" is escaped only where it would start a character reference like "&amp;", not in "R&D".
              .map((pattern): Unsafe =>
                pattern.character === '&' ? { ...pattern, after: '#?[A-Za-z0-9]+;', _compiled: undefined } : pattern
              );
            return defaultHandlers.root(node, parent, state, info);
          },
          // Spaces at the start or end of a line mean nothing in Markdown, and would be saved as "&#x20;".
          text: (node, parent, state, info) => {
            let value = node.value;
            if (info.before.endsWith('\n')) {
              value = value.replace(/^[ \t]+/, '');
            }
            if (info.after.startsWith('\n')) {
              value = value.replace(/[ \t]+$/, '');
            }
            return defaultHandlers.text({ ...node, value }, parent, state, info);
          },
          // A line break is a new line, which MarkdownText shows as one, not a backslash and a new line.
          break: (node, parent, state, info) => {
            const value = defaultHandlers.break(node, parent, state, info);
            return value === '\\\n' ? '\n' : value;
          },
          // A "www." address is saved as typed: "[www.x.nl](http://www.x.nl)" would show it twice in the CSV export.
          link: (node, parent, state, info) => {
            const [child] = node.children;
            const isWww = node.children.length === 1 && child.type === 'text' && child.value.startsWith('www.');
            return isWww && !node.title && node.url === `http://${child.value}`
              ? child.value
              : defaultHandlers.link(node, parent, state, info);
          },
        },
      });
      // Shift+Tab is liftNestedListItem, and Delete deletes forward instead of joining a list item to the one above.
      ctx.update(listItemKeymap.key, (keys) => ({
        ...keys,
        LiftListItem: { shortcuts: 'Mod-[' },
        LiftFirstListItem: { shortcuts: 'Backspace' },
      }));
    })
    .use([...presets, listItem, link, inlineCode, listItemKeymap, strongKeymap, emphasisKeymap].flat())
    .use([wrapInBulletListInputRule, wrapInOrderedListInputRule].flat())
    .use([history, shortcuts, pasteText, clipboard, trailing, changes].flat());

  await editor.create();
  const view = editor.action((ctx) => ctx.get(editorViewCtx));
  const loaded = markdown();
  if (loaded !== options.value && readTree(loaded) !== readTree(options.value)) {
    await editor.destroy();
    return null;
  }
  baseline = loaded;
  options.onStateChange(toolbarState(view.state));

  const { nodes, marks } = view.state.schema;
  const commands: Record<MarkdownAction, Command> = {
    bold: toggleMark(marks.strong),
    italic: toggleMark(marks.emphasis),
    strikethrough: toggleMark(marks.strike_through),
    code: toggleCode,
    bulletList: toggleList(nodes.bullet_list, nodes.ordered_list),
    orderedList: toggleList(nodes.ordered_list, nodes.bullet_list),
    quote: toggleQuote,
    undo,
    redo,
  };

  const runCommand = (command: Command) => {
    // Ctrl+A selects the whole document, around its blocks, where the list, quote and code commands find nothing.
    if (view.state.selection instanceof AllSelection) {
      const { $from, $to } = view.state.selection;
      view.dispatch(view.state.tr.setSelection(TextSelection.between($from, $to)));
    }
    command(view.state, view.dispatch, view);
    view.focus();
  };

  return {
    run: (action) => runCommand(commands[action]),
    setLineStyle: (level) => runCommand(level ? styleLines(nodes.heading, { level }) : styleLines(nodes.paragraph)),
    setLink: (href) => {
      const { from, to, empty } = view.state.selection;
      const range = empty ? linkAt(view.state) : { from, to };
      const tr = view.state.tr;
      if (range) {
        tr.removeMark(range.from, range.to, marks.link);
        if (href) {
          tr.addMark(range.from, range.to, marks.link.create({ href }));
        }
      } else if (href) {
        // With nothing selected, the address is the text of the link.
        tr.insertText(href, from).addMark(from, from + href.length, marks.link.create({ href }));
      }
      view.dispatch(tr.scrollIntoView());
      view.focus();
    },
    setProps: (isEditable, attributes) => view.setProps({ editable: () => isEditable, attributes }),
    focus: () => view.focus(),
    destroy: () => editor.destroy(),
  };
};
