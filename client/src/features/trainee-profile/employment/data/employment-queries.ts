import { useMutation, useQuery } from '@tanstack/react-query';
import {EmploymentHistory} from '../../../../data/types/Trainee';
import { addEmployment, deleteEmployment, editEmployment, getEmployments } from '../api/api';

/**
 * Hook to add employment to a trainee.
 * @param {string} traineeId the id of the trainee to add the employment to.
 * @param {EmploymentHistory} employment the employment to add.
 */
export const useAddEmployment = (traineeId: string) => {
  return useMutation({
    mutationFn: (employment: EmploymentHistory) => addEmployment(traineeId, employment),
  });
};

/**
 * Hook to get employments of a trainee.
 * @param {string} traineeId the id of the trainee to get the employments from.
 * @returns {UseQueryResult<EmploymentHistory[], Error>} the employments of the trainee.
 */
export const useGetEmployments = (traineeId: string) => {
  return useQuery({
    queryKey: ['employmentHistory', traineeId],
    queryFn: async () => {
      const data = await getEmployments(traineeId);
      return orderEmploymentsByDateDesc(data);
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
    mutationFn: (employmentId: string) => deleteEmployment(traineeId, employmentId),
  });
};

/**
 * Hook to edit employment of a trainee.
 * @param {string} traineeId the id of the trainee to edit the employment of.
 */
export const useEditEmployment = (traineeId: string) => {
  return useMutation({
    mutationFn: (employment: EmploymentHistory) => editEmployment(traineeId, employment),
  });
};

const orderEmploymentsByDateDesc = (data: EmploymentHistory[]): EmploymentHistory[] => {
  return data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
};
