import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type CustomSelectProps = {
  inputLabel: string;
  disabled?: boolean;
  id: string;
  label: string;
  name: string;
  value?: string; //currently selected value
  options: MenuItemType[]; // array of values to show in the dropdown
  isEditing?: boolean;
  error?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
};

export type MenuItemType = {
  label: string; //To be displayed to the user
  value: string;
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
    <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '25ch' }}>
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
        {options.map((option: MenuItemType) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {!!error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};
