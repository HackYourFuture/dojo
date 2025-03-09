import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps } from '@mui/material';

import React from 'react';

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  optionLabels: string[];
  width?: string;
  sx?: SxProps;
  required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  id,
  optionLabels: options,
  width = '100%',
  sx = {},
  required = false,
}) => {
  return (
    <FormControl variant="outlined" fullWidth style={{ width }} required={required}>
      <InputLabel>{label}</InputLabel>

      <Select id={id} name={id} value={value} onChange={onChange} label={label} sx={sx}>
        {options.map((option: string) => {
          // Convert the option to lowercase and replace spaces with hyphens
          const value = option.toLowerCase().replace(/\s+/g, '-');
          return (
            <MenuItem key={value} value={value}>
              {option}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default FormSelect;
