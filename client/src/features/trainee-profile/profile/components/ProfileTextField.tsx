import { TextField, TextFieldProps } from '@mui/material';

// Four fields and their gaps fit on a row of a 1440px wide screen.
export const PROFILE_FIELD_WIDTH = '24ch';

export type ProfileTextFieldProps = Omit<TextFieldProps, 'variant'> & {
  name: string;
  isEditing: boolean;
};

/**
 * A text field on the profile tabs: an outlined input while editing, a read-only value otherwise.
 */
export const ProfileTextField = ({
  name,
  value,
  isEditing,
  placeholder,
  sx = [],
  slotProps,
  ...props
}: ProfileTextFieldProps) => (
  <TextField
    id={name}
    {...props}
    name={name}
    value={value ?? ''}
    placeholder={isEditing ? placeholder : undefined}
    variant={isEditing ? 'outlined' : 'standard'}
    sx={[{ width: PROFILE_FIELD_WIDTH }, ...(Array.isArray(sx) ? sx : [sx])]}
    slotProps={{
      ...slotProps,
      input: { readOnly: !isEditing, ...slotProps?.input },
      inputLabel: { shrink: true },
    }}
  />
);
