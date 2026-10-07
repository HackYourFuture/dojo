import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { SelectOption } from '../data/types/SelectOption';

type DropdownSelectProps = {
  id: string;
  name: string;
  label: string;
  value?: string;
  options: SelectOption[];
  disabled?: boolean;
  error?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  width?: string | number;
};

/** An outlined dropdown with an error message below it, used by the dialogs that add a profile. */
export const DropdownSelect = ({
  id,
  name,
  label,
  value = '',
  options,
  disabled = false,
  error,
  onChange,
  width = '25ch',
}: DropdownSelectProps) => {
  const labelId = `${id}-label`;

  return (
    <FormControl sx={{ width }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        id={id}
        name={name}
        labelId={labelId}
        label={label}
        value={value}
        disabled={disabled}
        error={!!error}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {!!error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};
