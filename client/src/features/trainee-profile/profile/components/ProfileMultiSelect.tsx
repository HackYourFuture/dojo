import { Autocomplete, TextField } from '@mui/material';

import { ProfileValue } from './ProfileValue';
import { profileInputStyle } from './fieldStyles';

interface ProfileMultiSelectProps<T> {
  name: string;
  label: string;
  options: T[];
  value: T[];
  getOptionLabel: (option: T) => string;
  // Identifies options that are objects, which are compared by reference and keyed by their label otherwise.
  getOptionKey?: (option: T) => string;
  loading?: boolean;
  isEditing: boolean;
  onChange: (value: T[]) => void;
}

/** Several values on the profile tabs, sized like ProfileTextField: chips while editing, their labels otherwise. */
export const ProfileMultiSelect = <T,>({
  name,
  label,
  options,
  value,
  getOptionLabel,
  getOptionKey,
  loading,
  isEditing,
  onChange,
}: ProfileMultiSelectProps<T>) => {
  if (!isEditing) {
    return <ProfileValue label={label} value={value.map(getOptionLabel).join(', ')} />;
  }

  return (
    <Autocomplete
      id={name}
      multiple
      filterSelectedOptions
      disableCloseOnSelect
      size="small"
      options={options}
      value={value}
      loading={loading}
      getOptionLabel={getOptionLabel}
      getOptionKey={getOptionKey}
      isOptionEqualToValue={getOptionKey && ((option, selected) => getOptionKey(option) === getOptionKey(selected))}
      onChange={(_, selected) => onChange(selected)}
      sx={profileInputStyle}
      renderInput={(params) => (
        // Keeps the label props of the Autocomplete, which link the label to the input.
        <TextField {...params} label={label} slotProps={{ inputLabel: { ...params.InputLabelProps, shrink: true } }} />
      )}
    />
  );
};
