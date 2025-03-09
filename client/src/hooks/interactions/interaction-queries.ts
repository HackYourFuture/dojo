import { useMutation, useQuery } from 'react-query';

import { Interaction } from '../../models/Interactions';
import axios from 'axios';

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

export const useAddInteraction = (traineeId: string) => {
  // partial becase not all fields are sent to the backend
  return useMutation(async (interaction: Partial<Interaction>) => {
    return await axios.post(`/api/trainees/${traineeId}/interactions`, interaction);
  });
};

export const useDeleteInteraction = (traineeId: string) => {
  return useMutation(async (interactionId: string) => {
    try {
      return await axios.delete(`/api/trainees/${traineeId}/interactions/${interactionId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete interaction');
    }
  });
};
