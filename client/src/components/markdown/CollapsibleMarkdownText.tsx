import { Link, Typography } from '@mui/material';
import { useLayoutEffect, useRef, useState } from 'react';

import MarkdownText from './MarkdownText';

// About five lines. Text well past it is cut off there, with a link to show the rest.
const COLLAPSED_HEIGHT = 100;

/** Secondary markdown text in a table row, cut off with a "Show more" link when it is long. */
export const CollapsibleMarkdownText = ({ children }: { children: string }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isLong, setIsLong] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isCollapsed = isLong && !isExpanded;

  // Measured before painting, as only the browser knows how many lines the markdown wraps to.
  useLayoutEffect(() => {
    // The scroll height counts the cut-off part too. Half as much again, so the link never hides a line or two.
    setIsLong(textRef.current!.scrollHeight > COLLAPSED_HEIGHT * 1.5);
  }, [children]);

  return (
    <>
      <Typography
        ref={textRef}
        variant="body2"
        component="div"
        sx={{
          color: 'text.secondary',
          // Without the margin under the last paragraph, the text ends as far from the line as the other rows.
          '& > * > :last-child': { marginBottom: 0 },
          ...(isCollapsed && {
            maxHeight: COLLAPSED_HEIGHT,
            overflow: 'hidden',
            maskImage: 'linear-gradient(to bottom, black 70%, transparent)',
          }),
        }}
      >
        <MarkdownText>{children}</MarkdownText>
      </Typography>
      {isLong && (
        <Link component="button" variant="body2" underline="hover" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Show less' : 'Show more'}
        </Link>
      )}
    </>
  );
};
