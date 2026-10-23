import { Chip, ChipProps } from '@mui/material';
import { MentorPairingType, mentorPairingTypeLabels } from '../MentorPairingType';

const TYPE_COLORS: Record<MentorPairingType, ChipProps['color']> = {
  [MentorPairingType.TechMentorship]: 'info',
  [MentorPairingType.EnglishMentorship]: 'secondary',
  [MentorPairingType.HrMentorship]: 'success',
};

interface MentorPairingTypeChipProps {
  type: MentorPairingType;
}

/** A chip with what the volunteer mentors the trainee in. */
export const MentorPairingTypeChip = ({ type }: MentorPairingTypeChipProps) => (
  <Chip label={mentorPairingTypeLabels[type]} color={TYPE_COLORS[type]} size="small" variant="outlined" />
);
