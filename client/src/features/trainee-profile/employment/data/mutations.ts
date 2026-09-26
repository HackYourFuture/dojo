import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addEmploymentHistory, deleteEmploymentHistory, editEmploymentHistory } from '../api/api';

import { EmploymentHistory } from '../models/employment-history';
import { employmentHistoryKeys } from './keys';

const invalidateEmploymentHistoryQuery = (queryClient: QueryClient, traineeId: string) => {
  return queryClient.invalidateQueries({ queryKey: employmentHistoryKeys.list(traineeId) });
};

/**
 * Hook to add employment to a trainee.
 * @param {string} traineeId the id of the trainee to add the employment to.
 */
export const useAddEmploymentHistory = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employment: EmploymentHistory) => addEmploymentHistory(traineeId, employment),
    onSuccess: async () => await invalidateEmploymentHistoryQuery(queryClient, traineeId),
  });
};

/**
 * Hook to edit employment of a trainee.
 * @param {string} traineeId the id of the trainee to edit the employment of.
 */
export const useEditEmploymentHistory = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employment: EmploymentHistory) => editEmploymentHistory(traineeId, employment),
    onSuccess: async () => await invalidateEmploymentHistoryQuery(queryClient, traineeId),
  });
};

/**
 * Hook to delete employment from a trainee.
 * @param {string} traineeId the id of the trainee to delete the employment from.
 */
export const useDeleteEmploymentHistory = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employmentId: string) => deleteEmploymentHistory(traineeId, employmentId),
    onSuccess: async () => await invalidateEmploymentHistoryQuery(queryClient, traineeId),
  });
};
