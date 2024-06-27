import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Component for showing a list of trainee search results with links.
 *
 * @param {any} data search value.
 * @returns {ReactNode} A React element that renders a list of matching trainee names list as a clickable link.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SearchBar = ({ data }: any) => {

  /**
   * Function to set the value for search text field onChange event.
   * @param {string} value value entered to searchbox text field.
   */
  const handleChange = (value: string) => {
    data(value);
  };

  return (
    <Box sx={{ display: 'flex', width: 1 }}>
      <TextField
        variant="outlined"
        placeholder="Search trainee..."
        fullWidth
        autoFocus
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
