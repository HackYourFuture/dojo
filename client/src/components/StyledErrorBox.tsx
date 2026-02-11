import { Box } from '@mui/material';
import { ErrorBox } from './ErrorBox';

type StyledErrorBoxProps = {
  message: string;
};
export const StyledErrorBox: React.FC<StyledErrorBoxProps> = ({ message }) => {
  return (
    <Box width="50%" margin="auto" marginTop="2rem" marginBottom="2rem">
      <ErrorBox errorMessage={message} />
    </Box>
  );
};
