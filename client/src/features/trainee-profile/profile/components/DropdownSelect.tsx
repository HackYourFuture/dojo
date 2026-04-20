import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
} from '@mui/material';

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
  width?: string | number;
  sx?: SxProps<Theme>;
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
  width = '25ch',
  sx,
}: CustomSelectProps) => {
  const NoIcon = () => null;

  return (
    <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, gap: '2rem', width, ...sx }}>
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
