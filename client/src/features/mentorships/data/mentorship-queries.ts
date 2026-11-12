import { MentorshipFilters, MentorshipPerson } from '../Mentorship';
import { getLoadedItemsAndTotal, getNextPageParam } from '../../../data/pagination';
import { getMentorship, getMentorships } from '../api/api';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { PROFILE_QUERY_OPTIONS } from '../../../data/tanstack/tanstackClient';
import { ProfileType } from '../../../data/types/ProfileType';
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

/** Hook to get every mentorship of a volunteer or a trainee, for their profile, the latest start date first. */
export const useGetProfileMentorships = (profileType: MentorshipPerson, profileId: string) => {
  // Every status, so the ended ones are listed too. Under the list key, so the mentorship mutations reach it.
  return useGetMentorships({
    volunteerId: profileType === 'volunteer' ? profileId : '',
    traineeId: profileType === 'trainee' ? profileId : '',
    type: [],
    status: [],
  });
};

// The largest page the API gives, far more mentorships than one person has, so one page holds them all.
const MAX_PAGE_SIZE = 5000;

/** Hook to get every mentorship of a volunteer or a trainee at once, for the check-ins on their Interactions tab. */
export const useGetAllProfileMentorships = (profileType: ProfileType, profileId: string) => {
  return useQuery({
    // Under the list key, so the mentorship mutations reach it.
    queryKey: [...mentorshipKeys.list(), 'all', profileType, profileId],
    // Every status, so the ended ones are listed too.
    queryFn: () =>
      getMentorships(
        0,
        {
          volunteerId: profileType === 'volunteer' ? profileId : '',
          traineeId: profileType === 'trainee' ? profileId : '',
          type: [],
          status: [],
        },
        MAX_PAGE_SIZE
      ),
    // An organisation has no mentorships.
    enabled: profileType !== 'organisation',
  });
};

/** Hook to get one mentorship, for its profile. */
export const useGetMentorship = (mentorshipId: string) => {
  return useQuery({
    queryKey: mentorshipKeys.details(mentorshipId),
    queryFn: () => getMentorship(mentorshipId),
    enabled: !!mentorshipId,
    ...PROFILE_QUERY_OPTIONS,
  });
};
