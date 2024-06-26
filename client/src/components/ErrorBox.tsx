import { Alert } from '@mui/material';

export interface ErrorBoxProps {
  errorMessage: string;
}

export const ErrorBox = (props: ErrorBoxProps) => {
  return (
    <Alert
      severity="error"
      sx={{
        marginY: '24px',
        marginX: 'auto',
        width: '40%',
        wordBreak: 'break-word',
      }}
    >
      <p>{props.errorMessage}</p>
    </Alert>
  );
};
