import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import { MIN_SEARCH_QUERY_LENGTH, useGetSearchResults } from '../../search/data/search-queries';
import { SearchResult, SearchResultType } from '../../search/models/search-result';

import { PersonAvatar } from '../../../components/PersonAvatar';
import { TraineeReference } from '../../../data/types/Trainee';
import { useDebounce } from '../../../hooks/useDebounce';
import { useState } from 'react';

// A trainee to pick, with their cohort, which tells apart trainees with the same name. Only results have one.
type TraineeOption = TraineeReference & { cohort?: string | null };

const toTraineeOption = (result: SearchResult): TraineeOption => ({
  id: result.id,
  name: result.title,
  profilePath: result.path,
  thumbnailUrl: result.thumbnailUrl,
  cohort: result.subtitle,
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
  const { data: results = [], isFetching } = useGetSearchResults(query);
  const isTooShort = searchText.length < MIN_SEARCH_QUERY_LENGTH;
  // The search also finds volunteers, organisations and contact persons.
  const trainees = results.filter((result) => result.type === SearchResultType.Trainee).map(toTraineeOption);

  return (
    <Autocomplete<TraineeOption>
      forcePopupIcon={false}
      options={trainees}
      value={value}
      disabled={disabled}
      inputValue={text}
      onInputChange={(_, newText) => setText(newText)}
      onChange={(_, trainee) => onChange(trainee)}
      // The API already matched them, also on close spellings, which MUI's filter would drop.
      filterOptions={(options) => options}
      // Also until the typing pauses, so 'No trainees found' doesn't show before the search.
      loading={isFetching || (searchText !== query && !isTooShort)}
      noOptionsText={isTooShort ? `Type at least ${MIN_SEARCH_QUERY_LENGTH} letters` : 'No trainees found'}
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
              {trainee.cohort}
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
