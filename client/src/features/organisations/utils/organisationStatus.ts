import { OrganisationStatus } from '../Organisation';
import { SelectOption } from '../../../data/types/SelectOption';

export const organisationStatusLabels: Record<OrganisationStatus, string> = {
  [OrganisationStatus.Active]: 'Active',
  [OrganisationStatus.Inactive]: 'Inactive',
  [OrganisationStatus.NeverEngaged]: 'Never engaged',
};

// The options of the status dropdowns on the profile and in the add dialog.
export const organisationStatusOptions: SelectOption[] = Object.values(OrganisationStatus).map((status) => ({
  label: organisationStatusLabels[status],
  value: status,
}));
