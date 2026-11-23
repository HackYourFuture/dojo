import { OrganisationFilters } from '../Organisation';

const ORGANISATIONS_QUERY_KEY = 'organisations';

export const organisationKeys = {
  // Also matches every filtered list, so resetting it resets them all.
  list: () => [ORGANISATIONS_QUERY_KEY, 'list'] as const,
  filteredList: (filters: OrganisationFilters) => [ORGANISATIONS_QUERY_KEY, 'list', filters] as const,
  // Under the list's key, so the reset after deleting an organisation clears the picker's results too.
  search: (query: string) => [ORGANISATIONS_QUERY_KEY, 'list', 'search', query.toLowerCase()] as const,
  details: (organisationId: string) => [ORGANISATIONS_QUERY_KEY, 'details', organisationId] as const,
};
