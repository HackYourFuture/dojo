import { useMutation, useQuery } from '@tanstack/react-query';
import { Strike } from '../../../../../data/types/Trainee';
import { getStrikes, addStrike, deleteStrike, editStrike } from '../api/api';

/**
 * Hook to add a strike to a trainee.
 * @param {string} traineeId the id of the trainee to add the strike to.
 * @param {Strike} strike the strike to add.
 */
export const useAddStrike = (traineeId: string) => {
  return useMutation({
    mutationFn: (strike: Strike) => addStrike(traineeId, strike),
  });
};

/**
 * Hook to get the strikes of a trainee.
 * @param {string} traineeId the id of the trainee to get the strikes from.
 * @returns {UseQueryResult<Strike[], Error>} the strikes of the trainee.
 */
export const useGetStrikes = (traineeId: string) => {
  return useQuery({
    queryKey: ['strikes', traineeId],
    queryFn: async () => {
      const data = await getStrikes(traineeId);
      return orderStrikesByDateDesc(data);
    },
    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to delete a strike from a trainee.
 * @param {string} traineeId the id of the trainee to delete the strike from.
 * @param {string} strikeId the id of the strike to delete.
 * */

export const useDeleteStrike = (traineeId: string) => {
  return useMutation({
    mutationFn: (strikeId: string) => deleteStrike(traineeId, strikeId),
  });
};

/**
 * Hook to edit a strike of a trainee.
 * @param {string} traineeId the id of the trainee to edit the strike of.
 */
export const useEditStrike = (traineeId: string) => {
  return useMutation({
    mutationFn: (strike: Strike) => editStrike(traineeId, strike),
  });
};

const orderStrikesByDateDesc = (data: Strike[]): Strike[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
