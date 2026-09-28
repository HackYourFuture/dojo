import { TextField, TextFieldProps } from '@mui/material';

import { formatDateForDisplay } from '../../utils/dateHelper';

// Four fields and their gaps fit on a row of a 1440px wide screen.
export const PROFILE_FIELD_WIDTH = '24ch';

export type ProfileTextFieldProps = Omit<TextFieldProps, 'variant'> & {
  name: string;
  isEditing: boolean;
};

/**
 * A text, date or number field on the profile tabs: an outlined input while editing, a read-only value otherwise.
 */
export const ProfileTextField = ({
  name,
  value,
  type,
  isEditing,
  placeholder,
  sx = [],
  slotProps,
  ...props
}: ProfileTextFieldProps) => {
  // Shown like the other dates in Dojo, rather than in the format of the browser's language.
  const showsDateAsText = type === 'date' && !isEditing;

  return (
    <TextField
      id={name}
      {...props}
      name={name}
      type={showsDateAsText ? 'text' : type}
      value={showsDateAsText ? formatDateForDisplay(value as string | null) : (value ?? '')}
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
};
