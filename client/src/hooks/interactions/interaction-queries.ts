import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Interaction } from '../../models/Interactions';
import axios from 'axios';

/**
 * gets all interactions for a trainee
 * @param traineeId the id of the trainee
 * @returns an array of interactions for the trainee
 */
export const useGetInteractions = (traineeId: string) => {
  return useQuery({
    queryKey: ['interactions', traineeId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/trainees/${traineeId}/interactions`);
        return orderInteractionsByDateDesc(data as Interaction[]);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.error || 'Failed to get interactions');
        }
        throw new Error('Failed to get interactions');
      }
    },
    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

const orderInteractionsByDateDesc = (data: Interaction[]): Interaction[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Hook to add an interaction to a trainee.
 * @param {string} traineeId - The ID of the trainee to add the interaction to
 * @returns Mutation hook for adding an interaction
 */
export const useAddInteraction = (traineeId: string) => {
  const queryClient = useQueryClient();

  // partial becase not all fields are sent to the backend
  return useMutation({
    mutationFn: async (interaction: Partial<Interaction>) => {
      return await axios.post(`/api/trainees/${traineeId}/interactions`, interaction).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to add interaction');
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', traineeId] });
    },
  });
};

/**
 * Hook to delete an interaction from a trainee.
 * @param {string} traineeId - The ID of the trainee to delete the interaction from
 * @returns Mutation hook for deleting an interaction
 */
export const useDeleteInteraction = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interactionId: string) => {
      return await axios.delete(`/api/trainees/${traineeId}/interactions/${interactionId}`).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to delete interaction');
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', traineeId] });
    },
  });
};

/**
 * Hook to edit an existing interaction for a trainee.
 * @param {string} traineeId - The ID of the trainee
 * @returns Mutation hook for editing an interaction
 */
export const useEditInteraction = (traineeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (interaction: Interaction) => {
      return axios.put(`/api/trainees/${traineeId}/interactions/${interaction.id}`, interaction).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to edit interaction');
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', traineeId] });
    },
  });
};
