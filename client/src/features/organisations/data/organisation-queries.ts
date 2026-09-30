import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { OrganisationSummary, OrganisationSummaryPage } from '../Organisation';
import { getOrganisation, getOrganisationSummaries } from '../api/api';

import { organisationKeys } from './keys';

// Joins the loaded pages into one list. Outside the hook, so React Query only runs it when the pages change.
const selectOrganisations = (data: InfiniteData<OrganisationSummaryPage>): OrganisationSummary[] => {
  const seenIds = new Set<string>();

  // Pages are fetched by offset, so an organisation added or removed while scrolling can repeat a row.
  return data.pages
    .flatMap((page) => page.organisations)
    .filter((organisation) => {
      if (seenIds.has(organisation.id)) {
        return false;
      }
      seenIds.add(organisation.id);
      return true;
    });
};

/** Hook to get the organisations, page by page. */
export const useGetOrganisations = () => {
  return useInfiniteQuery({
    queryKey: organisationKeys.list(),
    queryFn: ({ pageParam }) => getOrganisationSummaries(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam + 1 < lastPage.totalPages ? lastPageParam + 1 : undefined,
    select: selectOrganisations,
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
