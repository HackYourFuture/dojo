import Link from '@mui/material/Link';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const MarkDownText = ({ children }: { children: string }) => (
  <Markdown
    remarkPlugins={[remarkBreaks, remarkGfm]}
    components={{
      a: ({ href, children }) => {
        const isExternal = href ? /^https?:\/\//.test(href) : false;
        if (!isExternal) {
          return <>{children}</>;
        }
        return (
          <Link href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {children}
          </Link>
        );
      },
    }}
  >
    {children}
  </Markdown>
);
export default MarkDownText;
