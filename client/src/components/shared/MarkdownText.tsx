import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const MarkDownText = ({ children }: { children: string }) => (
  <Markdown remarkPlugins={[remarkBreaks, remarkGfm]}>{children}</Markdown>
);
export default MarkDownText;
