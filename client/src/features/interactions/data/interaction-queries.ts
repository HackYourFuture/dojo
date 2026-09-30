import { ProfileType } from '../Interaction';
import { getInteractions } from '../api/api';
import { interactionKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

/** Gets the interactions of a trainee or an organisation. The server sends the most recent first. */
export const useGetInteractions = (profileType: ProfileType, profileId: string) => {
  return useQuery({
    queryKey: interactionKeys.list(profileType, profileId),
    queryFn: () => getInteractions(profileType, profileId),
    enabled: !!profileId,
    refetchOnWindowFocus: false,
  });
};
