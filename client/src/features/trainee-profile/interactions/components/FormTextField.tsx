import FormControl from '@mui/material/FormControl';
import React from 'react';
import { SxProps } from '@mui/material';
import TextField from '@mui/material/TextField';

interface FormTextFieldProps {
  label: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  sx?: SxProps;
  width?: string;
  disabled?: boolean;
  required?: boolean;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  value = '',
  onChange,
  error,
  helperText,
  placeholder = '',
  multiline = false,
  minRows = 1,
  maxRows = 1,
  sx = {},
  width = '100%',
  disabled = false,
  required = false,
}) => {
  return (
    <FormControl fullWidth error={error} style={{ width }}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        helperText={helperText}
        variant="outlined"
        fullWidth
        placeholder={placeholder}
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        sx={sx}
        disabled={disabled}
        required={required}
      />
    </FormControl>
  );
};

export default FormTextField;
