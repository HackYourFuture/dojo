import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Interaction } from '../Interactions';
import { getInteractions, addInteraction, deleteInteraction, editInteraction } from '../api/api';

/**
 * gets all interactions for a trainee
 * @param traineeId the id of the trainee
 * @returns an array of interactions for the trainee
 */
export const useGetInteractions = (traineeId: string) => {
  return useQuery({
    queryKey: ['interactions', traineeId],
    queryFn: async () => {
      const data = await getInteractions(traineeId);
      return orderInteractionsByDateDesc(data);
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

  // partial because not all fields are sent to the backend
  return useMutation({
    mutationFn: (interaction: Partial<Interaction>) => addInteraction(traineeId, interaction),
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
    mutationFn: (interactionId: string) => deleteInteraction(traineeId, interactionId),
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
    mutationFn: (interaction: Interaction) => editInteraction(traineeId, interaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', traineeId] });
    },
  });
};
