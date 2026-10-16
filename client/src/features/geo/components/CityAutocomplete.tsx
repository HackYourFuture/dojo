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
  disabled?: boolean;
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
  disabled,
  sx,
}: CityAutocompleteProps) => {
  const [text, setText] = useState('');
  const query = useDebounce(text, 250);
  const { data: cities = [], isFetching } = useSearchCities(query);
  const isTooShort = text.length < MIN_GEO_QUERY_LENGTH;

  return (
    <Autocomplete
      id={id}
      size="small"
      forcePopupIcon={false}
      options={cities}
      value={value}
      disabled={disabled}
      inputValue={text}
      onInputChange={(_, newText) => setText(newText)}
      onChange={(_, city) => onChange(city)}
      // The API already matched them, also on other names like Den Haag, which MUI's filter would drop.
      filterOptions={(results) => results}
      // Also until the typing pauses, so 'No cities found' doesn't show before the search.
      loading={isFetching || (text !== query && !isTooShort)}
      noOptionsText={isTooShort ? `Type at least ${MIN_GEO_QUERY_LENGTH} letters` : 'No cities found'}
      getOptionLabel={(city) => city.name}
      getOptionKey={(city) => city.id}
      isOptionEqualToValue={(option, city) => option.id === city.id}
      renderOption={({ key, ...optionProps }, city) => (
        <li key={key} {...optionProps}>
          {city.name}
          <Box
            component="span"
            sx={{ marginLeft: 'auto', paddingLeft: 3, color: 'text.secondary', fontSize: '0.875rem' }}
          >
            {city.province}
          </Box>
        </li>
      )}
      sx={sx}
      // Wider than the field when needed, so long names don't wrap.
      slotProps={{ popper: { placement: 'bottom-start', style: { minWidth: 'max-content' } } }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          slotProps={{ ...params.slotProps, inputLabel: { ...params.slotProps.inputLabel, shrink: true } }}
        />
      )}
    />
  );
};
