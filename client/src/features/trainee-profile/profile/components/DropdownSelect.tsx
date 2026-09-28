import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SelectOption } from '../../utils/selectOptions';

type DropdownSelectProps = {
  id: string;
  name: string;
  label: string;
  value?: string;
  options: SelectOption[];
  isEditing?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  width?: string | number;
};

// Hides the arrow while the dropdown is read-only.
const NoIcon = () => null;

/**
 * A dropdown that is outlined while editing, and a read-only value otherwise.
 */
export const DropdownSelect = ({
  id,
  name,
  label,
  value = '',
  options,
  isEditing = false,
  disabled = false,
  error,
  onChange,
  width = '25ch',
}: DropdownSelectProps) => {
  const labelId = `${id}-label`;

  return (
    <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ width }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        id={id}
        name={name}
        labelId={labelId}
        label={label}
        value={value}
        disabled={disabled}
        error={!!error}
        inputProps={{ readOnly: !isEditing }}
        IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
        // Keeps the label above the dropdown when it is empty, like the text fields.
        startAdornment=" "
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
