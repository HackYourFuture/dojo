import { getLoadedItems, getNextPageParam } from '../../../data/pagination';
import { getOrganisation, getOrganisationSummaries } from '../api/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { PROFILE_QUERY_OPTIONS } from '../../../data/tanstack/tanstackClient';
import { organisationKeys } from './keys';

/** Hook to get the organisations, page by page. */
export const useGetOrganisations = () => {
  return useInfiniteQuery({
    queryKey: organisationKeys.list(),
    queryFn: ({ pageParam }) => getOrganisationSummaries(pageParam),
    initialPageParam: 0,
    getNextPageParam,
    select: getLoadedItems,
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
