import { getLoadedItemsAndTotal, getNextPageParam } from '../../../data/pagination';
import { getOrganisation, getOrganisationSummaries, searchOrganisations } from '../api/api';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { OrganisationFilters } from '../Organisation';
import { PROFILE_QUERY_OPTIONS } from '../../../data/tanstack/tanstackClient';
import { organisationKeys } from './keys';

// The search finds nothing useful for a single letter.
export const MIN_ORGANISATION_QUERY_LENGTH = 2;

/** Hook to get the organisations that match the filters, page by page. */
export const useGetOrganisations = (filters: OrganisationFilters) => {
  return useInfiniteQuery({
    queryKey: organisationKeys.filteredList(filters),
    queryFn: ({ pageParam }) => getOrganisationSummaries(pageParam, filters),
    initialPageParam: 0,
    getNextPageParam,
    select: getLoadedItemsAndTotal,
    // The list stays on screen while the next filter loads.
    placeholderData: keepPreviousData,
  });
};

/** Hook to get the profile of an organisation. */
export const useGetOrganisation = (organisationId: string) => {
  return useQuery({
    queryKey: organisationKeys.details(organisationId),
    queryFn: () => getOrganisation(organisationId),
    enabled: !!organisationId,
    ...PROFILE_QUERY_OPTIONS,
  });
};

/** Hook to find organisations for a picker: the first page of the search, sorted by name. */
export const useSearchOrganisations = (query: string) => {
  return useQuery({
    queryKey: organisationKeys.search(query),
    queryFn: () => searchOrganisations(query),
    enabled: query.length >= MIN_ORGANISATION_QUERY_LENGTH,
  });
};
