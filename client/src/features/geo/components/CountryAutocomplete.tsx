import { Autocomplete, Box, SxProps, TextField, Theme } from '@mui/material';
import { MIN_GEO_QUERY_LENGTH, useSearchCountries } from '../data/geo-queries';

import { Country } from '../models/country';
import { useDebounce } from '../../../hooks/useDebounce';
import { useState } from 'react';

interface CountryAutocompleteProps {
  id?: string;
  label: string;
  value: Country | null;
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

  // MUI warns when the value is not one of the options, as when searching for another country.
  const options = value && !countries.some((country) => country.id === value.id) ? [value, ...countries] : countries;

  return (
    <Autocomplete
      id={id}
      size="small"
      options={options}
      value={value}
      inputValue={text}
      onInputChange={(_, newText) => setText(newText)}
      onChange={(_, country) => onChange(country)}
      // The API already filters, also on other names like Nederland, and spelling mistakes.
      filterOptions={(results) => results}
      filterSelectedOptions
      loading={isFetching || (text !== query && text.length >= MIN_GEO_QUERY_LENGTH)}
      noOptionsText={text.length < MIN_GEO_QUERY_LENGTH ? 'Type at least 2 letters' : 'No countries found'}
      getOptionLabel={(country) => country.name}
      getOptionKey={(country) => country.id}
      isOptionEqualToValue={(option, country) => option.id === country.id}
      renderOption={({ key, ...optionProps }, country) => (
        <li key={key} {...optionProps}>
          <Box component="span" aria-hidden sx={{ marginRight: 1.5, fontSize: '1.25rem' }}>
            {country.flag}
          </Box>
          {country.name}
        </li>
      )}
      sx={sx}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} error={error} helperText={helperText} />
      )}
    />
  );
};
