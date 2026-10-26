import { getLoadedItemsAndTotal, getNextPageParam } from '../../../data/pagination';
import { getVolunteer, getVolunteerSummaries, searchVolunteers } from '../api/api';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { PROFILE_QUERY_OPTIONS } from '../../../data/tanstack/tanstackClient';
import { VolunteerFilters } from '../Volunteer';
import { volunteerKeys } from './keys';

// The search finds nothing useful for a single letter.
export const MIN_VOLUNTEER_QUERY_LENGTH = 2;

/** Hook to get the volunteers that match the filters, page by page. */
export const useGetVolunteers = (filters: VolunteerFilters) => {
  return useInfiniteQuery({
    queryKey: volunteerKeys.filteredList(filters),
    queryFn: ({ pageParam }) => getVolunteerSummaries(pageParam, filters),
    initialPageParam: 0,
    getNextPageParam,
    select: getLoadedItemsAndTotal,
    // The list stays on screen while the next filter loads.
    placeholderData: keepPreviousData,
  });
};

/** Hook to get the profile of a volunteer. */
export const useGetVolunteer = (volunteerId: string) => {
  return useQuery({
    queryKey: volunteerKeys.details(volunteerId),
    queryFn: () => getVolunteer(volunteerId),
    enabled: !!volunteerId,
    ...PROFILE_QUERY_OPTIONS,
  });
};

/** Hook to find volunteers for a picker: the first page of the search, by first name. */
export const useSearchVolunteers = (query: string) => {
  return useQuery({
    queryKey: volunteerKeys.search(query),
    queryFn: () => searchVolunteers(query),
    enabled: query.length >= MIN_VOLUNTEER_QUERY_LENGTH,
  });
};
