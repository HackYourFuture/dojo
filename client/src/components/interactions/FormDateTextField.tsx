import FormControl from '@mui/material/FormControl';
import React from 'react';
import { SxProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import { formatDate } from '../../helpers/dateHelper';

interface FormDateTextFieldProps {
  label: string;
  value: Date | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  width?: string;
  sx?: SxProps;
}

const FormDateTextField: React.FC<FormDateTextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  width = '100%',
  sx = {},
}) => {
  return (
    <FormControl fullWidth error={error} style={{ width }}>
      <TextField
        type="date"
        label={label}
        value={value ? formatDate(value) : ''}
        onChange={onChange}
        helperText={helperText}
        variant="outlined"
        disabled={disabled}
        sx={sx}
      />
    </FormControl>
  );
};

export default FormDateTextField;
