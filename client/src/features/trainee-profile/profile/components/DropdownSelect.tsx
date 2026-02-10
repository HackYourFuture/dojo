import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { capitalize } from '../../utils/stringHelper';

type CustomSelectProps = {
  inputLabel: string;
  disabled?: boolean;
  id: string;
  label: string;
  name: string;
  value?: string | number; //currently selected value
  options: string[]; // array of values to show in the dropdown
  isEditing?: boolean;
  error?: string;
  onChange: (event: SelectChangeEvent<string | number>) => void;
};

export const DropdownSelect = ({
  disabled = false,
  inputLabel,
  id,
  label,
  name,
  value = '',
  options,
  isEditing = false,
  error,
  onChange = () => {},
}: CustomSelectProps) => {
  const NoIcon = () => null;

  return (
    <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch', gap: '2rem' }}>
      <InputLabel htmlFor={label}>{inputLabel}</InputLabel>
      <Select
        disabled={disabled}
        error={!!error}
        id={id}
        label={label}
        name={name}
        value={value}
        inputProps={{ readOnly: isEditing ? false : true }}
        IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
        startAdornment=" "
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {capitalize(option)}
          </MenuItem>
        ))}
        <FormHelperText error={!!error}>{error}</FormHelperText>
      </Select>
    </FormControl>
  );
};
