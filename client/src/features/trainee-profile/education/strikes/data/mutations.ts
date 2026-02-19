import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addStrike, deleteStrike, editStrike } from '../api/api';

import { Strike } from '../models/strike';
import { strikeKeys } from './keys';

const invalidateStrikesQuery = (queryClient: QueryClient, traineeId: string) => {
  return queryClient.invalidateQueries({ queryKey: strikeKeys.list(traineeId) });
};

/**
 * Hook to add a strike to a trainee.
 * @param {string} traineeId the id of the trainee to add the strike to.
 */
export const useAddStrike = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (strike: Strike) => {
      return addStrike(traineeId, strike);
    },
    onSuccess: async () => await invalidateStrikesQuery(queryClient, traineeId),
  });
};

/**
 * Hook to delete a strike from a trainee.
 * @param {string} traineeId the id of the trainee to delete the strike from.
 * */

export const useDeleteStrike = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (strikeId: string) => deleteStrike(traineeId, strikeId),
    onSuccess: async () => await invalidateStrikesQuery(queryClient, traineeId),
  });
};

/**
 * Hook to edit a strike of a trainee.
 * @param {string} traineeId the id of the trainee to edit the strike of.
 */
export const useEditStrike = (traineeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (strike: Strike) => {
      return editStrike(traineeId, strike);
    },
    onSuccess: async () => await invalidateStrikesQuery(queryClient, traineeId),
  });
};
