import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps } from '@mui/material';

import React from 'react';
import { formatTextToFriendly } from '../utils/formHelper';

interface FormSelectProps {
  id: string;
  label: string;
  value?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  optionLabels: string[];
  width?: string;
  sx?: SxProps;
  required?: boolean;
  disabled?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value = '',
  onChange,
  id,
  optionLabels: options,
  width = '100%',
  sx = {},
  required = false,
  disabled = false,
}) => {
  return (
    <FormControl variant="outlined" fullWidth style={{ width }} required={required}>
      <InputLabel>{label}</InputLabel>

      <Select id={id} name={id} value={value} onChange={onChange} label={label} sx={sx} disabled={disabled}>
        {options.map((option: string) => {
          // Convert the option to lowercase and replace spaces with hyphens
          const label = formatTextToFriendly(option);

          return (
            <MenuItem key={option} value={option}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default FormSelect;
