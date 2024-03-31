import { Box } from "@mui/material";

interface ErrorBoxProps {
  errorMessage: string;
}

export const ErrorBox = (props: ErrorBoxProps) => {
  return (
    <Box
      my={4}
      display="flex"
      alignItems="center"
      borderRadius={1}
      p={2}
      bgcolor="#FFCCBA"
    >
      <p className="error-message">{props.errorMessage}</p>
    </Box>
  );
};
