import Link from '@mui/material/Link';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const MarkDownText = ({ children }: { children: string }) => (
  <Markdown
    remarkPlugins={[remarkBreaks, remarkGfm]}
    components={{
      a: ({ href, children }) => (
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </Link>
      ),
    }}
  >
    {children}
  </Markdown>
);
export default MarkDownText;
