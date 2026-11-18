import { Button, Popover, Stack, TextField } from '@mui/material';

import { useState } from 'react';

// A web address, with https:// added when it has no scheme, or null for any other kind of link, which MarkdownText
// would not make clickable.
const toWebAddress = (text: string) => {
  // A scheme is the letters before the first colon, like "mailto" in "mailto:a@b.nl", not "is" in "?q=is:open".
  const colon = text.indexOf(':');
  const scheme = colon > 0 && /^[a-z]+$/i.test(text.slice(0, colon)) ? text.slice(0, colon).toLowerCase() : '';
  if (!scheme) {
    return `https://${text}`;
  }
  // "https:x.nl" is no link in MarkdownText, which needs the two slashes.
  return (scheme === 'http' || scheme === 'https') && text.startsWith('//', colon + 1)
    ? scheme + text.slice(colon)
    : null;
};

interface MarkdownLinkPopoverProps {
  anchorEl: HTMLElement;
  // The address of the link at the cursor, or '' for a new link.
  href: string;
  // An empty address removes the link.
  onApply: (href: string) => void;
  onClose: () => void;
}

/** The box under the link button of a MarkdownField, to add, change or remove the link of the selected text. */
export const MarkdownLinkPopover = ({ anchorEl, href, onApply, onClose }: MarkdownLinkPopoverProps) => {
  const [text, setText] = useState(href);
  const [error, setError] = useState('');

  const apply = () => {
    const address = text.trim() && toWebAddress(text.trim());
    if (address === null) {
      setError('Only web links, starting with http:// or https://');
      return;
    }
    onApply(address);
  };

  return (
    // When it closes, the focus goes back to the text, where the editor selects what was selected.
    <Popover open anchorEl={anchorEl} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
      <Stack direction="row" spacing={1} sx={{ padding: 1.5, alignItems: 'flex-start' }}>
        <TextField
          size="small"
          label="Link"
          placeholder="https://"
          autoFocus
          value={text}
          error={!!error}
          helperText={error || undefined}
          onChange={(event) => {
            setText(event.target.value);
            setError('');
          }}
          // Not a form: its submit would also reach the form of the dialog the field is in.
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              apply();
            }
          }}
          sx={{ width: '32ch' }}
        />
        {href && <Button onClick={() => onApply('')}>Remove</Button>}
        <Button variant="contained" onClick={apply}>
          Apply
        </Button>
      </Stack>
    </Popover>
  );
};
