import { Box, Link, SxProps, Theme, Typography } from '@mui/material';
import { PROFILE_FIELD_WIDTH, profileLabelStyle } from './fieldStyles';

import { ReactNode } from 'react';

interface ProfileValueProps {
  label?: ReactNode;
  // Text, or inline elements like the avatars of ProfileUserPicker.
  value: ReactNode;
  // Shown instead of an empty value.
  emptyText?: string;
  // Makes the value a link, opened in a new tab when it is a web page.
  href?: string;
  sx?: SxProps<Theme>;
}

/**
 * A field's label and value, shown instead of the input when the profile is not being edited.
 */
export const ProfileValue = ({ label, value, emptyText = '—', href, sx }: ProfileValueProps) => {
  const isEmpty = value === null || value === '';

  // In the text color, as a link in the primary color looks like an error message in dark mode.
  const text = href ? (
    <Link href={href} color="textPrimary" {...(href.startsWith('http') && { target: '_blank', rel: 'noopener' })}>
      {value}
    </Link>
  ) : (
    value
  );

  return (
    <Box sx={[{ width: PROFILE_FIELD_WIDTH }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {label && <Typography sx={{ color: 'text.secondary', ...profileLabelStyle }}>{label}</Typography>}
      {/* As tall as a small input, so the fields do not move when editing starts. */}
      <Typography
        sx={{
          color: isEmpty ? 'text.disabled' : undefined,
          paddingBottom: 2,
          whiteSpace: 'pre-line',
          overflowWrap: 'anywhere',
        }}
      >
        {isEmpty ? emptyText : text}
      </Typography>
    </Box>
  );
};
