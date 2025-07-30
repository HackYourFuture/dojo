import { Box, InputAdornment, TextField } from '@mui/material';
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
};

export const SearchBar = ({ onTextChange }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  // You can change search debounce time using this hook.
  const debouncedSearchTerm: string = useDebounce(searchTerm, 400);

  useEffect(() => {
    if (debouncedSearchTerm) {
      onTextChange(debouncedSearchTerm);
    }
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
        placeholder="Search trainee..."
        fullWidth
        autoFocus
        autoComplete="off"
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
