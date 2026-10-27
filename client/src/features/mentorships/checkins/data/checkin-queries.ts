import { getMentorshipCheckins } from '../api/api';
import { mentorshipCheckinKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

/** Hook to get the check-ins of a mentorship, the latest date first. */
export const useGetMentorshipCheckins = (mentorshipId: string) => {
  return useQuery({
    queryKey: mentorshipCheckinKeys.list(mentorshipId),
    queryFn: () => getMentorshipCheckins(mentorshipId),
  });
};
