import { Interaction } from '../../models/Interactions';
import axios from 'axios';
import { useQuery } from 'react-query';

/**
 * gets all interactions for a trainee
 * @param traineeId the id of the trainee
 * @returns an array of interactions for the trainee
 */
export const useGetInteractions = (traineeId: string) => {
  return useQuery(
    ['interactions', traineeId],
    () => {
      return axios.get(`/api/trainees/${traineeId}/interactions`);
    },
    {
      select: ({ data }) => {
        return orderInteractionsByDateDesc(data as Interaction[]);
      },
      enabled: !!traineeId,
      refetchOnWindowFocus: false,
    }
  );
};

const orderInteractionsByDateDesc = (data: Interaction[]): Interaction[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
