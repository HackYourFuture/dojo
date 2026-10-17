import { Badge, Box } from '@mui/material';

interface ProfileTabLabelProps {
  label: string;
  // The number of items on the tab, or undefined while they load.
  count: number | undefined;
}

/** The label of a profile tab with a list, with the number of items in a badge. */
export const ProfileTabLabel = ({ label, count }: ProfileTabLabelProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {label}
    {/* Static, so the badge sits next to the label instead of on its corner. Hidden while loading. */}
    <Badge
      badgeContent={count}
      showZero
      sx={{
        '& .MuiBadge-badge': {
          position: 'static',
          transform: 'none',
          bgcolor: 'action.selected',
          color: 'text.secondary',
        },
      }}
    />
  </Box>
);
