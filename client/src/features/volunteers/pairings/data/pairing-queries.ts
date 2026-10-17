import { getMentorPairings } from '../api/api';
import { mentorPairingKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

/** Hook to get the mentor pairings of a volunteer, the latest start date first. */
export const useGetMentorPairings = (volunteerId: string) => {
  return useQuery({
    queryKey: mentorPairingKeys.list(volunteerId),
    queryFn: () => getMentorPairings(volunteerId),
    // The tab label loads the list with the profile, so opening the tab reuses it. Changes invalidate it.
    refetchOnMount: false,
  });
};
