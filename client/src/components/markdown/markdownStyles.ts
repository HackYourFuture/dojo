// The look of Markdown text, the same where it is read (MarkdownText) and where it is written (MarkdownField).
export const markdownStyle = {
  // Long lines wrap instead of overflowing.
  overflowWrap: 'anywhere',
  // Markdown blocks have top margins, which would add a gap above the text.
  '& > *': { marginTop: 0 },
  // A quote, like a quoted message in Slack: a bar down the left, and no indent on the right.
  '& blockquote': {
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 1.5,
    borderLeft: 4,
    borderColor: 'divider',
    color: 'text.secondary',
    '& > *': { marginTop: 0 },
    '& > :last-child': { marginBottom: 0 },
  },
} as const;
