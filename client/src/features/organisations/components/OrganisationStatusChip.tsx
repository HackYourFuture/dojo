import { Chip, ChipProps } from '@mui/material';

import { OrganisationStatus } from '../Organisation';
import { organisationStatusLabels } from '../utils/organisationStatus';

const STATUS_COLORS: Record<OrganisationStatus, ChipProps['color']> = {
  [OrganisationStatus.Active]: 'success',
  [OrganisationStatus.Inactive]: 'warning',
  [OrganisationStatus.NeverEngaged]: 'default',
};

interface OrganisationStatusChipProps {
  status: OrganisationStatus;
}

/** A chip that shows where the partnership with the organisation stands. */
export const OrganisationStatusChip = ({ status }: OrganisationStatusChipProps) => (
  <Chip label={organisationStatusLabels[status]} color={STATUS_COLORS[status]} size="small" />
);
