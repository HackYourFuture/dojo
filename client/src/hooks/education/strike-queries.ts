import { Strike } from '../../models';
import axios from 'axios';
import { useMutation } from 'react-query';

export const useAddStrike = (traineeId: string) => {
  return useMutation((strike: Strike) => {
    return axios.post(`/api/trainees/${traineeId}/strikes`, strike).catch((error) => {
      throw new Error(error.response?.data?.error || 'Failed to add strike');
    });
  });
};
