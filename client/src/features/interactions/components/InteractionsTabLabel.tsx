import { Badge, Box } from '@mui/material';

import { ProfileType } from '../../../data/types/ProfileType';
import { tabCountBadgeStyle } from '../../../components/profile/fieldStyles';
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
      {/* Hidden while the interactions load. */}
      <Badge badgeContent={interactions?.length} showZero sx={tabCountBadgeStyle} />
    </Box>
  );
};
