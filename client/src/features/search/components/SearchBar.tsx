import { Box, InputAdornment, SxProps, TextField, Theme } from '@mui/material';
import { useEffect, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Component for gathering the search value from the user.
 *
 * @param {onTextChange} a callback that passes a string to the parent component.
 * @returns {ReactNode} A React element that renders a search bar.
 */

type SearchBarProps = {
  onTextChange: (text: string) => void;
  size?: 'small' | 'medium';
  autoFocus?: boolean;
  sx?: SxProps<Theme>;
};

// The search API rejects longer queries.
const MAX_QUERY_LENGTH = 100;

const SearchBar = ({ onTextChange, size, autoFocus, sx }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  // You can change search debounce time using this hook.
  const debouncedSearchTerm: string = useDebounce(searchTerm, 250);

  useEffect(() => {
    onTextChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onTextChange]);
  /**
   * Function to set the value for search text field onChange event.
   *
   * @param {string} value value entered to searchbox text field.
   */
  const handleChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Box sx={{ display: 'flex', width: 1 }}>
      <TextField
        variant="outlined"
        size={size}
        sx={sx}
        placeholder="Search..."
        fullWidth
        autoFocus={autoFocus}
        autoComplete="off"
        onChange={(e) => handleChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
          htmlInput: { maxLength: MAX_QUERY_LENGTH },
        }}
      />
    </Box>
  );
};

export default SearchBar;
