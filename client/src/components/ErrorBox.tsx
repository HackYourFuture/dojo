import { Alert } from "@mui/material";
import { ErrorBoxProps } from "../types";

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
      <p>{props.errorMessage}</p>
    </Alert>
  );
};
