import { OrganisationFilters } from '../Organisation';

const ORGANISATIONS_QUERY_KEY = 'organisations';

export const organisationKeys = {
  // Also matches every filtered list, so resetting it resets them all.
  list: () => [ORGANISATIONS_QUERY_KEY, 'list'] as const,
  filteredList: (filters: OrganisationFilters) => [ORGANISATIONS_QUERY_KEY, 'list', filters] as const,
  details: (organisationId: string) => [ORGANISATIONS_QUERY_KEY, 'details', organisationId] as const,
};
