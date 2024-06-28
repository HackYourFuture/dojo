import { Box, CircularProgress } from "@mui/material";

/**
 * Component to display a loading indicator / CircularProgress MUI component when status isLoading.
 */
export const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
      }}
    >
      <CircularProgress size={70} />
    </Box>
  );
};
