import { Chip, ChipProps } from '@mui/material';
import { VolunteerStatus, volunteerStatusLabels } from '../VolunteerStatus';

const STATUS_COLORS: Record<VolunteerStatus, ChipProps['color']> = {
  [VolunteerStatus.Active]: 'success',
  [VolunteerStatus.Paused]: 'warning',
  [VolunteerStatus.Stopped]: 'default',
};

interface VolunteerStatusChipProps {
  status: VolunteerStatus;
}

/** A chip that shows where the volunteer stands with HackYourFuture. */
export const VolunteerStatusChip = ({ status }: VolunteerStatusChipProps) => (
  <Chip label={volunteerStatusLabels[status]} color={STATUS_COLORS[status]} size="small" />
);
