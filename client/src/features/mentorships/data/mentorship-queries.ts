import { getLoadedItemsAndTotal, getNextPageParam } from '../../../data/pagination';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { MentorshipFilters } from '../Mentorship';
import { getMentorships } from '../api/api';
import { mentorshipKeys } from './keys';

/** Hook to get the mentorships that match the filters, page by page, the latest start date first. */
export const useGetMentorships = (filters: MentorshipFilters) => {
  return useInfiniteQuery({
    queryKey: mentorshipKeys.filteredList(filters),
    queryFn: ({ pageParam }) => getMentorships(pageParam, filters),
    initialPageParam: 0,
    getNextPageParam,
    select: getLoadedItemsAndTotal,
    // The list stays on screen while the next filter loads.
    placeholderData: keepPreviousData,
  });
};
