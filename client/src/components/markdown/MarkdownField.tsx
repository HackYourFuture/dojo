import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBaseComponentProps,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEvent,
  ReactNode,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { MarkdownButton, MarkdownEditor, MarkdownToolbarState } from './markdownEditor';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CodeIcon from '@mui/icons-material/Code';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { MarkdownLinkPopover } from './MarkdownLinkPopover';
import MarkdownText from './MarkdownText';
import RedoIcon from '@mui/icons-material/Redo';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import UndoIcon from '@mui/icons-material/Undo';
import { markdownStyle } from './markdownStyles';

const SHORTCUT_KEY = navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl+';

// The buttons of the toolbar, in groups between dividers, after the menu of line styles.
const BUTTON_GROUPS: { name: MarkdownButton; title: string; icon: ReactNode }[][] = [
  [
    { name: 'bold', title: `Bold (${SHORTCUT_KEY}B)`, icon: <FormatBoldIcon fontSize="small" /> },
    { name: 'italic', title: `Italic (${SHORTCUT_KEY}I)`, icon: <FormatItalicIcon fontSize="small" /> },
    { name: 'strikethrough', title: 'Strikethrough', icon: <StrikethroughSIcon fontSize="small" /> },
    { name: 'code', title: 'Code', icon: <CodeIcon fontSize="small" /> },
  ],
  [
    { name: 'bulletList', title: 'Bulleted list', icon: <FormatListBulletedIcon fontSize="small" /> },
    { name: 'orderedList', title: 'Numbered list', icon: <FormatListNumberedIcon fontSize="small" /> },
    { name: 'quote', title: 'Quote', icon: <FormatQuoteIcon fontSize="small" /> },
  ],
  [{ name: 'link', title: `Link (${SHORTCUT_KEY}K)`, icon: <InsertLinkIcon fontSize="small" /> }],
  [
    { name: 'undo', title: `Undo (${SHORTCUT_KEY}Z)`, icon: <UndoIcon fontSize="small" /> },
    { name: 'redo', title: 'Redo', icon: <RedoIcon fontSize="small" /> },
  ],
];

// The styles of a line, by heading level, each shown in the menu in its own size.
const LINE_STYLES = [
  { label: 'Text', fontSize: '1rem' },
  { label: 'Heading 1', fontSize: '1.5rem' },
  { label: 'Heading 2', fontSize: '1.25rem' },
  { label: 'Heading 3', fontSize: '1.1rem' },
];

// MUI's padding of an outlined input, and the line height of the text.
const PADDING_Y = 16.5;
const LINE_HEIGHT = 1.5;

// Shown under a note that the editor would change the meaning of, which is then edited as Markdown text.
const PLAIN_TEXT_HINT = 'This note has formatting the editor cannot show, so it is edited as Markdown text.';

// What MUI renders in place of the <input>: a toolbar over the editor, which reports changes as an input does.
const MarkdownInput = ({
  className,
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  required,
  minRows,
  maxRows,
  onPlainText,
  'aria-label': ariaLabel,
  'aria-describedby': describedBy,
  'aria-invalid': isInvalid,
}: InputBaseComponentProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  // The link button, under which the link box opens, also for the shortcut.
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const [editor, setEditor] = useState<MarkdownEditor | null>(null);
  const [toolbar, setToolbar] = useState<MarkdownToolbarState>({ pressed: {}, enabled: {}, lineStyle: 0, link: '' });
  const [linkAnchor, setLinkAnchor] = useState<HTMLElement | null>(null);
  const [styleAnchor, setStyleAnchor] = useState<HTMLElement | null>(null);

  // Read once: every dialog and profile makes a new field for each note it edits.
  const getValue = useEffectEvent(() => value);
  const emitChange = useEffectEvent((markdown: string) =>
    onChange?.({ target: { name, value: markdown } } as ChangeEvent<HTMLInputElement>)
  );

  // The editor is loaded on first use, so its library is not in the main bundle.
  useEffect(() => {
    const root = rootRef.current!;
    const note = getValue();
    let isMounted = true;
    let created: MarkdownEditor | null = null;
    import('./markdownEditor')
      .then(({ createMarkdownEditor }) =>
        createMarkdownEditor(root, {
          value: note,
          onChange: (markdown) => emitChange(markdown),
          onStateChange: setToolbar,
          onLinkShortcut: () => setLinkAnchor(linkButtonRef.current),
        })
      )
      .then(
        (result) => {
          created = result;
          if (!isMounted) {
            result?.destroy();
          } else if (result) {
            setEditor(result);
          } else {
            onPlainText('unsupported');
          }
        },
        // Like a stale chunk after a deploy: the note can still be edited as text.
        (error: unknown) => {
          console.error(error);
          onPlainText('failed');
        }
      );
    return () => {
      isMounted = false;
      created?.destroy();
    };
  }, [onPlainText]);

  // Before the editor is shown, so it never shows editable while saving, or without its label.
  useLayoutEffect(() => {
    editor?.setProps(!disabled, {
      'aria-multiline': 'true',
      // The editable text is a div, which the label cannot point at.
      ...(ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': `${id}-label` }),
      ...(describedBy && { 'aria-describedby': describedBy }),
      ...(isInvalid === true && { 'aria-invalid': 'true' }),
      ...(required && { 'aria-required': 'true' }),
    });
  }, [editor, disabled, id, required, ariaLabel, describedBy, isInvalid]);

  return (
    <Box
      className={className}
      // MUI's handlers only need to know that the focus came or went.
      onFocus={(event) => onFocus?.(event as unknown as FocusEvent<HTMLInputElement>)}
      onBlur={(event) => onBlur?.(event as unknown as FocusEvent<HTMLInputElement>)}
    >
      <Stack
        direction="row"
        role="toolbar"
        aria-label="Formatting"
        divider={<Divider orientation="vertical" flexItem sx={{ marginX: 0.5 }} />}
        // Clicking a button leaves the focus, and the selection, in the text.
        onMouseDown={(event) => event.preventDefault()}
        // One tab stop, as in other toolbars: Tab reaches its first control, the arrow keys the others.
        onKeyDown={(event) => {
          const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
          if (!step) {
            return;
          }
          event.preventDefault();
          const controls = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
          controls[controls.indexOf(event.target as HTMLButtonElement) + step]?.focus();
        }}
        sx={{
          flexWrap: 'wrap',
          paddingX: 0.5,
          paddingY: 0.25,
          borderBottom: 1,
          borderColor: 'divider',
          cursor: 'default',
        }}
      >
        <Button
          size="small"
          color="inherit"
          endIcon={<ArrowDropDownIcon />}
          disabled={disabled || !editor}
          onClick={(event) => setStyleAnchor(event.currentTarget)}
          sx={{ minWidth: '12ch', justifyContent: 'space-between' }}
        >
          {LINE_STYLES[toolbar.lineStyle ?? 0]?.label ?? `Heading ${toolbar.lineStyle}`}
        </Button>
        {BUTTON_GROUPS.map((group) => (
          <Stack key={group[0].name} direction="row">
            {group.map(({ name, title, icon }) => (
              <Tooltip key={name} title={title}>
                <IconButton
                  ref={name === 'link' ? linkButtonRef : undefined}
                  size="small"
                  // Reached with the arrow keys from the first control of the toolbar.
                  tabIndex={-1}
                  aria-pressed={toolbar.pressed[name]}
                  disabled={disabled || !editor || toolbar.enabled[name] === false}
                  onClick={(event) => (name === 'link' ? setLinkAnchor(event.currentTarget) : editor?.run(name))}
                  sx={{ borderRadius: 1, backgroundColor: toolbar.pressed[name] ? 'action.selected' : undefined }}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}
          </Stack>
        ))}
      </Stack>
      <Box
        sx={{
          // The text scrolls under the toolbar.
          maxHeight: maxRows ? `calc(${maxRows * LINE_HEIGHT}em + ${2 * PADDING_Y}px)` : undefined,
          overflowY: 'auto',
          // A long line wraps instead of widening the dialogs that are as wide as their content.
          contain: 'inline-size',
          ...(disabled && { pointerEvents: 'none' }),
          '& .ProseMirror, & .MarkdownField-loading': {
            ...markdownStyle,
            outline: 0,
            paddingX: '14px',
            paddingY: `${PADDING_Y}px`,
            minHeight: `${minRows * LINE_HEIGHT}em`,
            lineHeight: LINE_HEIGHT,
          },
          // Every line is a paragraph, so without the gap that MarkdownText puts between paragraphs.
          '& .ProseMirror p': { margin: 0 },
          // But the line before a list, quote or heading has the gap that MarkdownText puts under a paragraph.
          '& .ProseMirror > p:has(+ :not(p))': { marginBottom: '1em' },
          // Only web links look like links, as only they are links in MarkdownText.
          '& .ProseMirror a': { color: 'inherit', textDecoration: 'none' },
          '& .ProseMirror a[href^="http"]': { color: 'primary.main', textDecoration: 'underline' },
        }}
      >
        {/* The note, until the editor is loaded. */}
        {!editor && (
          <Box className="MarkdownField-loading">
            <MarkdownText>{value}</MarkdownText>
          </Box>
        )}
        <div ref={rootRef} hidden={!editor} />
      </Box>
      <Menu anchorEl={styleAnchor} open={!!styleAnchor} onClose={() => setStyleAnchor(null)}>
        {LINE_STYLES.map(({ label, fontSize }, level) => (
          <MenuItem
            key={label}
            // Like in a code block, or on the first line of a list item.
            disabled={toolbar.lineStyle === null}
            selected={level === toolbar.lineStyle}
            onClick={() => {
              setStyleAnchor(null);
              editor?.setLineStyle(level);
            }}
            sx={{ fontSize, fontWeight: level ? 'bold' : undefined }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
      {linkAnchor && editor && (
        <MarkdownLinkPopover
          anchorEl={linkAnchor}
          href={toolbar.link}
          onApply={(href) => {
            setLinkAnchor(null);
            editor.setLink(href);
          }}
          onClose={() => setLinkAnchor(null)}
        />
      )}
    </Box>
  );
};

interface MarkdownFieldProps {
  name: string;
  // A visible label, or an aria-label where something else labels the field, like the title of a profile section.
  label?: string;
  'aria-label'?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  minRows?: number;
  maxRows?: number;
}

/** A multi-line text field with a toolbar for headings, bold, lists, quotes and links, whose value is Markdown. */
export const MarkdownField = ({ 'aria-label': ariaLabel, minRows = 2, maxRows, ...props }: MarkdownFieldProps) => {
  // Why the note is edited as plain text instead, if it is.
  const [plainReason, setPlainReason] = useState<'unsupported' | 'failed' | null>(null);

  if (plainReason) {
    return (
      <TextField
        {...props}
        multiline
        fullWidth
        minRows={minRows}
        maxRows={maxRows}
        helperText={props.helperText ?? (plainReason === 'unsupported' ? PLAIN_TEXT_HINT : undefined)}
        // The limit of the API, which the editor leaves to the API.
        slotProps={{ htmlInput: { maxLength: 5000, 'aria-label': ariaLabel } }}
      />
    );
  }

  return (
    <TextField
      {...props}
      multiline
      fullWidth
      // The toolbar reaches the border, so the text has the padding of the input instead.
      sx={{ '& .MuiInputBase-root': { padding: 0 } }}
      slotProps={{
        // Above the toolbar, where the label of an empty field would otherwise sit.
        inputLabel: { shrink: true },
        input: { inputComponent: MarkdownInput },
        htmlInput: { minRows, maxRows, 'aria-label': ariaLabel, onPlainText: setPlainReason },
      }}
    />
  );
};
