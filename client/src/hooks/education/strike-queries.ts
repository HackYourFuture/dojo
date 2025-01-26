import { useMutation, useQuery } from 'react-query';

import { Strike } from '../../models';
import axios from 'axios';

export const useAddStrike = (traineeId: string) => {
  return useMutation((strike: Strike) => {
    return axios.post(`/api/trainees/${traineeId}/strikes`, strike).catch((error) => {
      throw new Error(error.response?.data?.error || 'Failed to add strike');
    });
  });
};

export const useGetStrikes = (traineeId: string) => {
  return useQuery(
    ['strikes', traineeId],
    () => {
      return axios.get<Strike[]>(`/api/trainees/${traineeId}/strikes`);
    },
    {
      select: ({ data }) => {
        return orderByDateDesc(data as Strike[]);
      },
      enabled: !!traineeId,
      refetchOnWindowFocus: false,
    }
  );
};

const orderByDateDesc = (data: Strike[]): Strike[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
