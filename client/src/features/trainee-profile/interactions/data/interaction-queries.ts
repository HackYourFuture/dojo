import { Interaction } from '../models/interaction';
import { getInteractions } from '../api/api';
import { interactionKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

/**
 * gets all interactions for a trainee
 * @param traineeId the id of the trainee
 * @returns an array of interactions for the trainee
 */
export const useGetInteractions = (traineeId: string) => {
  return useQuery({
    queryKey: interactionKeys.list(traineeId),
    queryFn: async () => {
      const interactions = await getInteractions(traineeId);
      return orderInteractionsByDateDesc(interactions);
    },
    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

const orderInteractionsByDateDesc = (data: Interaction[]): Interaction[] => {
  return data.sort((a, b) => b.date.getTime() - a.date.getTime());
};
