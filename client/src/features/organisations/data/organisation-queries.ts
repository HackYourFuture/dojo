import { getLoadedItems, getNextPageParam } from '../../../data/pagination';
import { getOrganisation, getOrganisationSummaries } from '../api/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { organisationKeys } from './keys';

/** Hook to get the organisations, page by page. */
export const useGetOrganisations = () => {
  return useInfiniteQuery({
    queryKey: organisationKeys.list(),
    queryFn: ({ pageParam }) => getOrganisationSummaries(pageParam),
    initialPageParam: 0,
    getNextPageParam,
    select: getLoadedItems,
    refetchOnWindowFocus: false,
  });
};

/** Hook to get the profile of an organisation. */
export const useGetOrganisation = (organisationId: string) => {
  return useQuery({
    queryKey: organisationKeys.details(organisationId),
    queryFn: () => getOrganisation(organisationId),
    enabled: !!organisationId,
    // The edit form diffs against this data, so a refetch mid-edit would save a colleague's newer values back.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
