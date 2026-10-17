import { getNextPageParam, selectList } from '../../../data/pagination';
import { getVolunteer, getVolunteerSummaries } from '../api/api';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { PROFILE_QUERY_OPTIONS } from '../../../data/tanstack/tanstackClient';
import { VolunteerFilters } from '../Volunteer';
import { volunteerKeys } from './keys';

/** Hook to get the volunteers that match the filters, page by page. */
export const useGetVolunteers = (filters: VolunteerFilters) => {
  return useInfiniteQuery({
    queryKey: volunteerKeys.filteredList(filters),
    queryFn: ({ pageParam }) => getVolunteerSummaries(pageParam, filters),
    initialPageParam: 0,
    getNextPageParam,
    select: selectList,
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
