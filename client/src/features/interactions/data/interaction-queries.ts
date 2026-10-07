import { ProfileType } from '../../../data/types/ProfileType';
import { getInteractions } from '../api/api';
import { interactionKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

/** Gets the interactions of a profile. The server sends the most recent first. */
export const useGetInteractions = (profileType: ProfileType, profileId: string) => {
  return useQuery({
    queryKey: interactionKeys.list(profileType, profileId),
    queryFn: () => getInteractions(profileType, profileId),
    enabled: !!profileId,
    // The tab label loads the list with the profile, so opening the tab reuses it. Changes invalidate it.
    refetchOnMount: false,
  });
};
