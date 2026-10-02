import { Autocomplete, SxProps, TextField, Theme } from '@mui/material';

import { ProfileValue } from './ProfileValue';
import { profileInputStyle } from './fieldStyles';

interface ProfileMultiSelectProps<T extends string> {
  name: string;
  label: string;
  options: T[];
  value: T[];
  getOptionLabel: (option: T) => string;
  isEditing: boolean;
  onChange: (value: T[]) => void;
  sx?: SxProps<Theme>;
}

/** Several values on the profile tabs, sized like ProfileTextField: chips while editing, their labels otherwise. */
export const ProfileMultiSelect = <T extends string>({
  name,
  label,
  options,
  value,
  getOptionLabel,
  isEditing,
  onChange,
  sx = [],
}: ProfileMultiSelectProps<T>) => {
  if (!isEditing) {
    return <ProfileValue label={label} value={value.map(getOptionLabel).join(', ')} sx={sx} />;
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
      getOptionLabel={getOptionLabel}
      onChange={(_, selected) => onChange(selected)}
      sx={[profileInputStyle, ...(Array.isArray(sx) ? sx : [sx])]}
      renderInput={(params) => (
        // Keeps the label props of the Autocomplete, which link the label to the input.
        <TextField
          {...params}
          label={label}
          slotProps={{ ...params.slotProps, inputLabel: { ...params.slotProps.inputLabel, shrink: true } }}
        />
      )}
    />
  );
};
