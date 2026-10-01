import { Badge, Box } from '@mui/material';

import { ProfileType } from '../../../data/types/ProfileType';
import { useGetInteractions } from '../data/interaction-queries';

interface InteractionsTabLabelProps {
  profileType: ProfileType;
  profileId: string;
}

/** The label of the interactions tab, with the number of interactions in a badge. */
export const InteractionsTabLabel = ({ profileType, profileId }: InteractionsTabLabelProps) => {
  const { data: interactions } = useGetInteractions(profileType, profileId);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      Interactions
      {/* Static, so the badge sits next to the label instead of on its corner. Hidden while loading. */}
      <Badge
        badgeContent={interactions?.length}
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
};
