import TextField, { TextFieldProps } from '@mui/material/TextField';

import React from 'react';
import { Stack } from '@mui/material';

type TextFieldWrapperProps = TextFieldProps & {
  maxLength?: number;
};

const TextFieldWrapper: React.FC<TextFieldWrapperProps> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // maxLength is ignored for number type, so we need to check the length of the value manually
    if (props.maxLength && props.type === 'number' && value.length > props.maxLength) {
      return;
    }

    props.onChange?.(e);
  };
  return (
    <Stack>
      <TextField
        type="text" //defaults to text. This could be overriden by passing type in props
        {...props}
        onChange={handleChange}
        value={props.value ?? ''}
        slotProps={{ htmlInput: { maxLength: props.maxLength || 100 } }}
      />
    </Stack>
  );
};

export default TextFieldWrapper;
