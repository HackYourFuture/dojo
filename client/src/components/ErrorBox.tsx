import { Alert } from "@mui/material";

interface ErrorBoxProps {
  errorMessage: string;
}

export const ErrorBox = (props: ErrorBoxProps) => {
  return (
    <Alert
      severity="error"
      sx={{
        marginY: "24px",
      }}
    >
      {props.errorMessage}
    </Alert>
  );
};
