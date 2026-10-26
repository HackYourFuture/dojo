import { MentorshipStatus, mentorshipStatusLabels } from '../MentorshipStatus';

import { Chip } from '@mui/material';

interface MentorshipStatusChipProps {
  isEnded: boolean;
}

/** A chip that shows whether the mentorship still runs, like the volunteer's status chip. */
export const MentorshipStatusChip = ({ isEnded }: MentorshipStatusChipProps) => (
  <Chip
    label={mentorshipStatusLabels[isEnded ? MentorshipStatus.Ended : MentorshipStatus.Active]}
    color={isEnded ? 'default' : 'success'}
    size="small"
  />
);
