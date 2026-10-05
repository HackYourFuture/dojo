import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const preStyle = { whiteSpace: 'pre-wrap' as const };

// Markdown blocks have top margins, which would add a gap above the text. Long lines wrap instead of overflowing.
const rootStyle = { overflowWrap: 'anywhere', '& > *': { marginTop: 0 } } as const;

const MarkdownText = ({ children }: { children: string }) => (
  <Box sx={rootStyle}>
    <Markdown
      remarkPlugins={[remarkBreaks, remarkGfm]}
      components={{
        pre: ({ children }) => <pre style={preStyle}>{children}</pre>,
        a: ({ href, children }) => {
          // Only links to web pages are clickable, and they open in a new tab.
          if (!href?.startsWith('http://') && !href?.startsWith('https://')) {
            return <>{children}</>;
          }
          return (
            <Link href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </Link>
          );
        },
      }}
    >
      {children}
    </Markdown>
  </Box>
);
export default MarkdownText;
