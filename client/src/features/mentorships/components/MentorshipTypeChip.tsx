import { Chip, ChipProps } from '@mui/material';
import { MentorshipType, mentorshipTypeLabels } from '../MentorshipType';

const getTypeColor = (type: MentorshipType): ChipProps['color'] => {
  if (type === MentorshipType.TechMentorship) {
    return 'info';
  }
  if (type === MentorshipType.EnglishMentorship) {
    return 'secondary';
  }
  if (type === MentorshipType.HrMentorship) {
    return 'success';
  }
  return 'default';
};

interface MentorshipTypeChipProps {
  type: MentorshipType;
}

/** A chip with what the volunteer mentors the trainee in. */
export const MentorshipTypeChip = ({ type }: MentorshipTypeChipProps) => (
  <Chip label={mentorshipTypeLabels[type]} color={getTypeColor(type)} size="small" variant="outlined" />
);
