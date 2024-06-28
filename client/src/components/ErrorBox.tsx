import { Alert, AlertTitle } from "@mui/material";

export interface ErrorBoxProps {
  errorMessage: string;
}

/**
 * Component to display a error state / Alert MUI component when status is ‘isError’.
 */
export const ErrorBox = (props: ErrorBoxProps) => {
  return (
    <Alert
      severity="error"
      sx={{
        marginY: "24px",
        marginX: "auto",
        width: "40%",
        wordBreak: "break-word",
      }}
    >
      <AlertTitle>Error</AlertTitle>
      <p>{props.errorMessage}</p>
    </Alert>
  );
};
