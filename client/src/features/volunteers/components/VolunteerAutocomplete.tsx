import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import { MIN_VOLUNTEER_QUERY_LENGTH, useSearchVolunteers } from '../data/volunteer-queries';
import { VolunteerReference, VolunteerSummary } from '../Volunteer';
import { VolunteerStatus, volunteerStatusLabels } from '../VolunteerStatus';

import { PersonAvatar } from '../../../components/PersonAvatar';
import { useDebounce } from '../../../hooks/useDebounce';
import { useState } from 'react';

// A volunteer to pick, with their status, so a paused or stopped one stands out. Only search results have one.
type VolunteerOption = VolunteerReference & { status?: VolunteerStatus };

const toVolunteerOption = (volunteer: VolunteerSummary): VolunteerOption => ({
  id: volunteer.id,
  name: volunteer.displayName,
  profilePath: volunteer.profilePath,
  thumbnailUrl: volunteer.thumbnailUrl,
  status: volunteer.status,
});

interface VolunteerAutocompleteProps {
  label: string;
  value: VolunteerReference | null;
  onChange: (volunteer: VolunteerReference | null) => void;
  error?: string;
  disabled?: boolean;
}

/** Picks a volunteer, searched on the API as the user types. */
export const VolunteerAutocomplete = ({ label, value, onChange, error, disabled }: VolunteerAutocompleteProps) => {
  const [text, setText] = useState('');
  const query = useDebounce(text, 250);
  const { data: volunteers = [], isFetching } = useSearchVolunteers(query);
  const isTooShort = text.length < MIN_VOLUNTEER_QUERY_LENGTH;

  return (
    <Autocomplete<VolunteerOption>
      forcePopupIcon={false}
      options={volunteers.map(toVolunteerOption)}
      value={value}
      disabled={disabled}
      inputValue={text}
      onInputChange={(_, newText) => setText(newText)}
      onChange={(_, volunteer) => onChange(volunteer)}
      // Enter picks the highlighted option but never sends the form, which may still hold the person picked before.
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      }}
      // The API already matched them, also on close spellings, which MUI's filter would drop.
      filterOptions={(volunteers) => volunteers}
      // Also until the typing pauses, so 'No volunteers found' doesn't show before the search.
      loading={isFetching || (text !== query && !isTooShort)}
      noOptionsText={isTooShort ? `Type at least ${MIN_VOLUNTEER_QUERY_LENGTH} letters` : 'No volunteers found'}
      getOptionLabel={(volunteer) => volunteer.name}
      getOptionKey={(volunteer) => volunteer.id}
      isOptionEqualToValue={(option, volunteer) => option.id === volunteer.id}
      renderOption={({ key, ...optionProps }, volunteer) => (
        <li key={key} {...optionProps}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
            <PersonAvatar src={volunteer.thumbnailUrl} size={28} />
            {volunteer.name}
            <Box
              component="span"
              sx={{ marginLeft: 'auto', paddingLeft: 3, color: 'text.secondary', fontSize: '0.875rem' }}
            >
              {volunteer.status && volunteerStatusLabels[volunteer.status]}
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
          error={!!error}
          helperText={error}
          slotProps={{
            ...params.slotProps,
            // The picked volunteer's picture before their name, but not before a search for someone else.
            input: {
              ...params.slotProps.input,
              startAdornment: value && text === value.name && (
                <InputAdornment position="start">
                  <PersonAvatar src={value.thumbnailUrl} size={24} />
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
