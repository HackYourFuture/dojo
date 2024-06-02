import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Search = ({ data }: any) => {
  const handleChange = (value: string) => {
    data(value);
  };

  return (
    <Box sx={{ display: "flex", width: 1 }}>
      <TextField
        variant="outlined"
        placeholder="Search trainee..."
        fullWidth
        autoFocus
        // value={input}
        onChange={(e) => handleChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
