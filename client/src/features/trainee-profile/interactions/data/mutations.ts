import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addInteraction, deleteInteraction, editInteraction } from '../api/api';

import { Interaction } from '../models/interaction';
import { interactionKeys } from './keys';

const invalidateInteractionsQuery = (queryClient: QueryClient, traineeId: string) => {
  return queryClient.invalidateQueries({ queryKey: interactionKeys.list(traineeId) });
};

/**
 * Hook to add an interaction to a trainee.
 * @param {string} traineeId - The ID of the trainee to add the interaction to
 */
export const useAddInteraction = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interaction: Interaction) => addInteraction(traineeId, interaction),
    onSuccess: async () => await invalidateInteractionsQuery(queryClient, traineeId),
  });
};

/**
 * Hook to edit an existing interaction of a trainee.
 * @param {string} traineeId - The ID of the trainee
 */
export const useEditInteraction = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interaction: Interaction) => editInteraction(traineeId, interaction),
    onSuccess: async () => await invalidateInteractionsQuery(queryClient, traineeId),
  });
};

/**
 * Hook to delete an interaction from a trainee.
 * @param {string} traineeId - The ID of the trainee to delete the interaction from
 */
export const useDeleteInteraction = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interactionId: string) => deleteInteraction(traineeId, interactionId),
    onSuccess: async () => await invalidateInteractionsQuery(queryClient, traineeId),
  });
};
