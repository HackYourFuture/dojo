import { getLoadedItems, getNextPageParam } from '../../../data/pagination';
import { getVolunteer, getVolunteerSummaries } from '../api/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { PROFILE_QUERY_OPTIONS } from '../../../data/tanstack/tanstackClient';
import { volunteerKeys } from './keys';

/** Hook to get the volunteers, page by page. */
export const useGetVolunteers = () => {
  return useInfiniteQuery({
    queryKey: volunteerKeys.list(),
    queryFn: ({ pageParam }) => getVolunteerSummaries(pageParam),
    initialPageParam: 0,
    getNextPageParam,
    select: getLoadedItems,
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
