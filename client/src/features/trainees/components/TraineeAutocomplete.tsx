import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import { MIN_TRAINEE_QUERY_LENGTH, useSearchTrainees } from '../data/trainees-queries';

import { PersonAvatar } from '../../../components/PersonAvatar';
import { TraineeReference } from '../../../data/types/Trainee';
import { TraineeSummary } from '../models/trainee-summary';
import { useDebounce } from '../../../hooks/useDebounce';
import { useState } from 'react';

// A trainee to pick, with their cohort, which tells apart trainees with the same name. Only search results have one.
type TraineeOption = TraineeReference & { cohort?: number | null };

const toTraineeOption = (trainee: TraineeSummary): TraineeOption => ({
  id: trainee.id,
  name: trainee.displayName,
  profilePath: trainee.profilePath,
  thumbnailUrl: trainee.thumbnailUrl,
  cohort: trainee.cohort,
});

interface TraineeAutocompleteProps {
  label: string;
  value: TraineeReference | null;
  onChange: (trainee: TraineeReference | null) => void;
  error?: string;
  disabled?: boolean;
}

/** Picks a trainee, searched on the API as the user types. */
export const TraineeAutocomplete = ({ label, value, onChange, error, disabled }: TraineeAutocompleteProps) => {
  const [text, setText] = useState('');
  // The text is the picked trainee's name until the user types, which needs no search.
  const searchText = text === value?.name ? '' : text;
  const query = useDebounce(searchText, 250);
  const { data: trainees = [], isFetching } = useSearchTrainees(query);
  const isTooShort = searchText.length < MIN_TRAINEE_QUERY_LENGTH;

  return (
    <Autocomplete<TraineeOption>
      forcePopupIcon={false}
      options={trainees.map(toTraineeOption)}
      value={value}
      disabled={disabled}
      inputValue={text}
      onInputChange={(_, newText) => setText(newText)}
      onChange={(_, trainee) => onChange(trainee)}
      // The API already matched them, also on close spellings, which MUI's filter would drop.
      filterOptions={(trainees) => trainees}
      // Also until the typing pauses, so 'No trainees found' doesn't show before the search.
      loading={isFetching || (searchText !== query && !isTooShort)}
      noOptionsText={isTooShort ? `Type at least ${MIN_TRAINEE_QUERY_LENGTH} letters` : 'No trainees found'}
      getOptionLabel={(trainee) => trainee.name}
      getOptionKey={(trainee) => trainee.id}
      isOptionEqualToValue={(option, trainee) => option.id === trainee.id}
      renderOption={({ key, ...optionProps }, trainee) => (
        <li key={key} {...optionProps}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
            <PersonAvatar src={trainee.thumbnailUrl} name={trainee.name} size={28} />
            {trainee.name}
            <Box
              component="span"
              sx={{ marginLeft: 'auto', paddingLeft: 3, color: 'text.secondary', fontSize: '0.875rem' }}
            >
              {typeof trainee.cohort === 'number' ? `Cohort ${trainee.cohort}` : 'No cohort assigned'}
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
            // The picked trainee's picture before their name, but not before a search for someone else.
            input: {
              ...params.slotProps.input,
              startAdornment: value && !searchText && (
                <InputAdornment position="start">
                  <PersonAvatar src={value.thumbnailUrl} name={value.name} size={24} />
                </InputAdornment>
              ),
            },
            inputLabel: { ...params.slotProps.inputLabel, shrink: true },
          }}
        />
      )}
    />
  );
};
