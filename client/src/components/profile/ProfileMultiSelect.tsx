import { Autocomplete, SxProps, TextField, Theme } from '@mui/material';
import { SyntheticEvent } from 'react';

import { ProfileValue } from './ProfileValue';
import { profileInputStyle } from './fieldStyles';

interface ProfileMultiSelectProps<T extends string> {
  name: string;
  label: string;
  options: T[];
  value: T[];
  getOptionLabel: (option: T) => string;
  isEditing: boolean;
  onChange: (name: string, value: T[]) => void;
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

  // Reported in the order of the options, which is the order the server keeps them in.
  const handleChange = (_: SyntheticEvent, selected: T[]) => {
    onChange(
      name,
      options.filter((option) => selected.includes(option))
    );
  };

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
      onChange={handleChange}
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
