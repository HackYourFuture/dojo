import { Alert, SxProps } from '@mui/material';

export interface ErrorBoxProps {
  errorMessage: string;
  sx?: SxProps;
}

/**
 * Component to display a error state / Alert MUI component when status is ‘isError’.
 */
export const ErrorBox = ({ errorMessage, sx = {} }: ErrorBoxProps) => {
  return (
    <Alert
      severity="error"
      sx={{
        marginTop: '0.5rem',
        wordBreak: 'break-word',
        width: '100%',
        ...sx,
      }}
    >
      {errorMessage}
    </Alert>
  );
};
