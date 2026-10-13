import { Autocomplete, Box, SxProps, TextField, Theme } from '@mui/material';
import { MIN_GEO_QUERY_LENGTH, useSearchCountries } from '../data/geo-queries';

import { Country } from '../models/country';
import { useDebounce } from '../../../hooks/useDebounce';
import { useState } from 'react';

interface CountryAutocompleteProps {
  id?: string;
  label: string;
  value: Pick<Country, 'name'> | null;
  onChange: (country: Country | null) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
}

/** Picks a country, searched on the API by its English or Dutch name as the user types. */
export const CountryAutocomplete = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  sx,
}: CountryAutocompleteProps) => {
  const [text, setText] = useState('');
  const query = useDebounce(text, 250);
  const { data: countries = [], isFetching } = useSearchCountries(query);
  const isTooShort = text.length < MIN_GEO_QUERY_LENGTH;

  return (
    <Autocomplete
      id={id}
      size="small"
      forcePopupIcon={false}
      options={countries}
      // MUI types the value as an option, but only reads its name.
      value={value as Country | null}
      inputValue={text}
      onInputChange={(_, newText) => setText(newText)}
      onChange={(_, country) => onChange(country)}
      // The API already matched them, also on other names like Nederland, which MUI's filter would drop.
      filterOptions={(results) => results}
      // Also until the typing pauses, so 'No countries found' doesn't show before the search.
      loading={isFetching || (text !== query && !isTooShort)}
      noOptionsText={isTooShort ? `Type at least ${MIN_GEO_QUERY_LENGTH} letters` : 'No countries found'}
      getOptionLabel={(country) => country.name}
      getOptionKey={(country) => country.id}
      // The names are unique, so a value with only a name matches its option.
      isOptionEqualToValue={(option, country) => option.name === country.name}
      renderOption={({ key, ...optionProps }, country) => (
        <li key={key} {...optionProps}>
          <Box component="span" aria-hidden sx={{ marginRight: 1.5, fontSize: '1.25rem' }}>
            {country.flag}
          </Box>
          {country.name}
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
