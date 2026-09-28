// Four fields and their gaps fit on a row of a 1440px wide screen.
export const PROFILE_FIELD_WIDTH = '24ch';

// The label above every field, the same while editing, so it does not move when editing starts.
export const profileLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '0.02em',
  marginBottom: 0.5,
} as const;

// An outlined input as wide as a field, with its label above it where ProfileValue has it, instead of in its border.
export const profileInputStyle = {
  width: PROFILE_FIELD_WIDTH,
  '& .MuiInputLabel-root': { position: 'static', transform: 'none', maxWidth: 'none', ...profileLabelStyle },
  // Closes the border's gap for the label as MUI does, since the date picker ignores notched={false}.
  '& fieldset > legend': { maxWidth: '0.01px' },
} as const;
