import { PartnershipType } from '../Organisation';

export const partnershipTypeLabels: Record<PartnershipType, string> = {
  [PartnershipType.Volunteer]: 'Volunteer',
  [PartnershipType.Funding]: 'Funding',
  [PartnershipType.Employment]: 'Employment',
  [PartnershipType.Events]: 'Events',
};
