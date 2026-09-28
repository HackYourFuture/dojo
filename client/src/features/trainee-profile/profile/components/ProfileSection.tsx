import { Stack, Typography } from '@mui/material';

import { ReactNode } from 'react';

// The space between the fields of a FieldRow.
export const PROFILE_FIELD_GAP = '24px';

interface ProfileSectionProps {
  title?: string;
  // Shown at the end of the title, like a button to add an item to the section's list.
  action?: ReactNode;
  children: ReactNode;
}

/**
 * A group of fields, or a list, on a profile tab. The title is optional.
 */
export const ProfileSection = ({ title, action, children }: ProfileSectionProps) => (
  <Stack spacing={2} useFlexGap>
    {title && (
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{title}</Typography>
        {action}
      </Stack>
    )}
    {children}
  </Stack>
);

interface FieldRowProps {
  // The fields share the width of the row equally, instead of each having the standard width.
  fill?: boolean;
  children: ReactNode;
}

/**
 * A line of fields that wraps onto the next line when the screen is too narrow for all of them.
 */
export const FieldRow = ({ fill = false, children }: FieldRowProps) => (
  <Stack
    direction="row"
    flexWrap="wrap"
    columnGap={PROFILE_FIELD_GAP}
    rowGap={2}
    sx={fill ? { '& > *': { flex: 1, minWidth: 0 } } : undefined}
  >
    {children}
  </Stack>
);
