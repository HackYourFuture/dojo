import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import { MIN_ORGANISATION_QUERY_LENGTH, useSearchOrganisations } from '../data/organisation-queries';
import { OrganisationReference, OrganisationStatus } from '../Organisation';

import { OrganisationLogo } from '../../../components/OrganisationLogo';
import { organisationStatusLabels } from '../utils/organisationStatus';
import { useDebounce } from '../../../hooks/useDebounce';
import { useState } from 'react';

// An organisation to pick, with its status, so an inactive one stands out. Only search results have one.
type OrganisationOption = OrganisationReference & { status?: OrganisationStatus };

interface OrganisationAutocompleteProps {
  label: string;
  value: OrganisationReference | null;
  onChange: (organisation: OrganisationReference | null) => void;
  error?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
  // Shown while no organisation is picked.
  placeholder?: string;
}

/** Picks an organisation, searched on the API as the user types. */
export const OrganisationAutocomplete = ({
  label,
  value,
  onChange,
  error,
  disabled,
  size,
  placeholder,
}: OrganisationAutocompleteProps) => {
  const [text, setText] = useState('');
  const query = useDebounce(text, 250);
  const { data: organisations = [], isFetching } = useSearchOrganisations(query);
  const isTooShort = text.length < MIN_ORGANISATION_QUERY_LENGTH;

  return (
    <Autocomplete<OrganisationOption>
      forcePopupIcon={false}
      size={size}
      options={organisations}
      value={value}
      disabled={disabled}
      inputValue={text}
      onInputChange={(_, newText) => setText(newText)}
      onChange={(_, organisation) => onChange(organisation)}
      // Enter picks the highlighted option but never sends the form, which may still hold the one picked before.
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      }}
      // The API already matched them, also on close spellings, which MUI's filter would drop.
      filterOptions={(organisations) => organisations}
      // Also until the typing pauses, so 'No organisations found' doesn't show before the search.
      loading={isFetching || (text !== query && !isTooShort)}
      noOptionsText={isTooShort ? `Type at least ${MIN_ORGANISATION_QUERY_LENGTH} letters` : 'No organisations found'}
      getOptionLabel={(organisation) => organisation.name}
      getOptionKey={(organisation) => organisation.id}
      isOptionEqualToValue={(option, organisation) => option.id === organisation.id}
      renderOption={({ key, ...optionProps }, organisation) => (
        <li key={key} {...optionProps}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
            <OrganisationLogo src={organisation.thumbnailUrl} name={organisation.name} size={28} />
            {organisation.name}
            <Box
              component="span"
              sx={{ marginLeft: 'auto', paddingLeft: 3, color: 'text.secondary', fontSize: '0.875rem' }}
            >
              {organisation.status && organisationStatusLabels[organisation.status]}
            </Box>
          </Box>
        </li>
      )}
      // Wider than the field when needed, so long names don't wrap.
      slotProps={{ popper: { placement: 'bottom-start', style: { minWidth: 'max-content' } } }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error}
          slotProps={{
            ...params.slotProps,
            // The picked organisation's logo before its name, but not before a search for another one.
            input: {
              ...params.slotProps.input,
              startAdornment: value && text === value.name && (
                <InputAdornment position="start">
                  <OrganisationLogo src={value.thumbnailUrl} name={value.name} size={24} />
                </InputAdornment>
              ),
            },
            // The API rejects a longer search.
            htmlInput: { ...params.slotProps.htmlInput, maxLength: 100 },
            inputLabel: { ...params.slotProps.inputLabel, shrink: true },
          }}
        />
      )}
    />
  );
};
