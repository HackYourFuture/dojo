import { Autocomplete, Box, SxProps, TextField, Theme } from '@mui/material';
import { MIN_GEO_QUERY_LENGTH, useSearchCities } from '../data/geo-queries';

import { City } from '../models/city';
import { useDebounce } from '../../../hooks/useDebounce';
import { useState } from 'react';

interface CityAutocompleteProps {
  id?: string;
  label: string;
  value: City | null;
  onChange: (city: City | null) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
}

/** Picks a Dutch city, town or village, searched on the API as the user types. */
export const CityAutocomplete = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  sx,
}: CityAutocompleteProps) => {
  const [text, setText] = useState('');
  const query = useDebounce(text, 250);
  const { data: cities = [], isFetching } = useSearchCities(query);

  // MUI warns when the value is not one of the options, as when searching for another city.
  const options = value && !cities.some((city) => city.id === value.id) ? [value, ...cities] : cities;

  return (
    <Autocomplete
      id={id}
      size="small"
      options={options}
      value={value}
      inputValue={text}
      onInputChange={(_, newText) => setText(newText)}
      onChange={(_, city) => onChange(city)}
      // The API already filters, also on other names like Den Haag, and spelling mistakes.
      filterOptions={(results) => results}
      filterSelectedOptions
      loading={isFetching || (text !== query && text.length >= MIN_GEO_QUERY_LENGTH)}
      noOptionsText={text.length < MIN_GEO_QUERY_LENGTH ? 'Type at least 2 letters' : 'No cities found'}
      getOptionLabel={(city) => city.name}
      getOptionKey={(city) => city.id}
      isOptionEqualToValue={(option, city) => option.id === city.id}
      renderOption={({ key, ...optionProps }, city) => (
        <li key={key} {...optionProps}>
          {city.name}
          <Box component="span" sx={{ marginLeft: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
            {city.province}
          </Box>
        </li>
      )}
      sx={sx}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} error={error} helperText={helperText} />
      )}
    />
  );
};
