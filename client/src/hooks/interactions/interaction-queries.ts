import { useMutation, useQuery, useQueryClient } from 'react-query';

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
  const queryClient = useQueryClient();

  // partial becase not all fields are sent to the backend
  return useMutation(
    async (interaction: Partial<Interaction>) => {
      return await axios.post(`/api/trainees/${traineeId}/interactions`, interaction);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['interactions', traineeId]);
      },
    }
  );
};

export const useDeleteInteraction = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (interactionId: string) => {
      return await axios.delete(`/api/trainees/${traineeId}/interactions/${interactionId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['interactions', traineeId]);
      },
    }
  );
};

/**
 * Hook to edit a interaction of a trainee.
 * @param {string} traineeId the id of the trainee to edit the interaction of.
 */
export const useEditInteraction = (traineeId: string) => {
  return useMutation((interaction: Interaction) => {
    return axios.put(`/api/trainees/${traineeId}/interactions/${interaction.id}`, interaction).catch((error) => {
      throw new Error(error.response?.data?.error || 'Failed to edit interaction');
    });
  });
};
