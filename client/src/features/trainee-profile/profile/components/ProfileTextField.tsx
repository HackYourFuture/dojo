import { TextField, TextFieldProps } from '@mui/material';

import { ProfileValue } from './ProfileValue';
import { profileInputStyle } from './fieldStyles';

export type ProfileTextFieldProps = Omit<TextFieldProps, 'variant' | 'value'> & {
  name: string;
  value: string | null;
  isEditing: boolean;
  // Opened from the value when not editing.
  href?: string;
};

/**
 * A text field on the profile tabs: an outlined input while editing, the label and value otherwise.
 */
export const ProfileTextField = ({
  name,
  label,
  value,
  isEditing,
  href,
  sx = [],
  slotProps,
  ...props
}: ProfileTextFieldProps) => {
  if (!isEditing) {
    return <ProfileValue label={label} value={value} href={href} sx={sx} />;
  }

  return (
    <TextField
      id={name}
      {...props}
      name={name}
      label={label}
      value={value ?? ''}
      size="small"
      sx={[profileInputStyle, ...(Array.isArray(sx) ? sx : [sx])]}
      slotProps={{ ...slotProps, inputLabel: { shrink: true } }}
    />
  );
};
