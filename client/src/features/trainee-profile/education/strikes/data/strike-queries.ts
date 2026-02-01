import { useMutation, useQuery } from '@tanstack/react-query';

import { Strike } from '../../../../../data/types/Trainee';
import axios from 'axios';

/**
 * Hook to add a strike to a trainee.
 * @param {string} traineeId the id of the trainee to add the strike to.
 * @param {Strike} strike the strike to add.
 */
export const useAddStrike = (traineeId: string) => {
  return useMutation({
    mutationFn: async (strike: Strike) => {
      return axios.post(`/api/trainees/${traineeId}/strikes`, strike).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to add strike');
      });
    },
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
      const { data } = await axios.get<Strike[]>(`/api/trainees/${traineeId}/strikes`);
      return orderStrikesByDateDesc(data as Strike[]);
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
    mutationFn: async (strikeId: string) => {
      return axios.delete(`/api/trainees/${traineeId}/strikes/${strikeId}`);
    },
  });
};

/**
 * Hook to edit a strike of a trainee.
 * @param {string} traineeId the id of the trainee to edit the strike of.
 */
export const useEditStrike = (traineeId: string) => {
  return useMutation({
    mutationFn: async (strike: Strike) => {
      return axios.put(`/api/trainees/${traineeId}/strikes/${strike.id}`, strike).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to edit strike');
      });
    },
  });
};

const orderStrikesByDateDesc = (data: Strike[]): Strike[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
