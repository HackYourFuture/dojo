import { Autocomplete, Box, SxProps, TextField, Theme } from '@mui/material';
import { MIN_GEO_QUERY_LENGTH, useSearchCities } from '../data/geo-queries';

import { City } from '../models/city';
import { useDebounce } from '../../../hooks/useDebounce';
import { useState } from 'react';

interface CityAutocompleteProps {
  id?: string;
  label: string;
  value: Pick<City, 'name'> | null;
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
  const isTooShort = text.length < MIN_GEO_QUERY_LENGTH;

  return (
    <Autocomplete
      id={id}
      size="small"
      forcePopupIcon={false}
      options={cities}
      // MUI types the value as an option, but only reads its name.
      value={value as City | null}
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
      // The names are unique, so a value with only a name matches its option.
      isOptionEqualToValue={(option, city) => option.name === city.name}
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
