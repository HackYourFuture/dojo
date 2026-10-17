import { getNextPageParam, selectList } from '../../../data/pagination';
import { getOrganisation, getOrganisationSummaries } from '../api/api';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { OrganisationFilters } from '../Organisation';
import { PROFILE_QUERY_OPTIONS } from '../../../data/tanstack/tanstackClient';
import { organisationKeys } from './keys';

/** Hook to get the organisations that match the filters, page by page. */
export const useGetOrganisations = (filters: OrganisationFilters) => {
  return useInfiniteQuery({
    queryKey: organisationKeys.filteredList(filters),
    queryFn: ({ pageParam }) => getOrganisationSummaries(pageParam, filters),
    initialPageParam: 0,
    getNextPageParam,
    select: selectList,
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
