import { FormHelperText, Stack } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';

import React from 'react';

type TextFieldWrapperProps = TextFieldProps & {
  // Add custom props here if needed
};

const TextFieldWrapper: React.FC<TextFieldWrapperProps> = (props) => {
  const { id, error, helperText } = props;
  return (
    <Stack>
      <TextField type="text" {...props} />
    </Stack>
  );
};

export default TextFieldWrapper;
