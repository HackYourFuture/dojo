import { useMutation, useQuery } from '@tanstack/react-query';

import {EmploymentHistory} from '../../../../data/types/Trainee';
import axios from 'axios';

/**
 * Hook to add employment to a trainee.
 * @param {string} traineeId the id of the trainee to add the employment to.
 * @param {EmploymentHistory} employment the employment to add.
 */
export const useAddEmployment = (traineeId: string) => {
  return useMutation({
    mutationFn: async (employment: EmploymentHistory) => {
      return axios.post(`/api/trainees/${traineeId}/employment-history`, employment).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to add employment');
      });
    },
  });
};

/**
 * Hook to get employments of a trainee.
 * @param {string} traineeId the id of the trainee to get the employments from.
 * @returns {UseQueryResult<Emp[EmploymentHistory[], Error>} the employments of the trainee.
 */
export const useGetEmployments = (traineeId: string) => {
  return useQuery({
    queryKey: ['employmentHistory', traineeId],
    queryFn: async () => {
      const { data } = await axios.get<EmploymentHistory[]>(`/api/trainees/${traineeId}/employment-history`);
      return orderEmploymentsByDateDesc(data as EmploymentHistory[]);
    },
    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to delete employment from a trainee.
 * @param {string} traineeId the id of the trainee to delete the employment from.
 * @param {string} employmentId the id of the employment to delete.
 * */

export const useDeleteEmployment = (traineeId: string) => {
  return useMutation({
    mutationFn: async (employmentId: string) => {
      return axios.delete(`/api/trainees/${traineeId}/employment-history/${employmentId}`);
    },
  });
};

/**
 * Hook to edit employment of a trainee.
 * @param {string} traineeId the id of the trainee to edit the employment of.
 */
export const useEditEmployment = (traineeId: string) => {
  return useMutation({
    mutationFn: async (employment: EmploymentHistory) => {
      return axios.put(`/api/trainees/${traineeId}/employment-history/${employment.id}`, employment).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to edit employment');
      });
    },
  });
};

const orderEmploymentsByDateDesc = (data: EmploymentHistory[]): EmploymentHistory[] => {
  return data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
};
