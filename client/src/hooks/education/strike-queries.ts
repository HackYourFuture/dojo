import { Strike } from '../../models';
import axios from 'axios';
import { useMutation } from 'react-query';

/**
 * Hook to add a strike to a trainee.
 * @param {string} traineeId the id of the trainee to add the strike to.
 * @param {Strike} strike the strike to add.
 */
export const useAddStrike = (traineeId: string) => {
  return useMutation((strike: Strike) => {
    return axios.post(`/api/trainees/${traineeId}/strikes`, strike).catch((error) => {
      throw new Error(error.response?.data?.error || 'Failed to add strike');
    });
  });
};
