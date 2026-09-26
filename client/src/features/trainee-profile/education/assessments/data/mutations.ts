import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addAssessment, deleteAssessment, editAssessment } from '../api/api';

import { Assessment } from '../models/assessment';
import { assessmentKeys } from './keys';

const invalidateAssessmentsQuery = (queryClient: QueryClient, traineeId: string) => {
  return queryClient.invalidateQueries({ queryKey: assessmentKeys.list(traineeId) });
};

/**
 * Hook to add an assessment to a trainee.
 * @param {string} traineeId the id of the trainee to add the assessment to.
 */
export const useAddAssessment = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessment: Assessment) => addAssessment(traineeId, assessment),
    onSuccess: async () => await invalidateAssessmentsQuery(queryClient, traineeId),
  });
};

/**
 * Hook to edit an assessment of a trainee.
 * @param {string} traineeId the id of the trainee to edit the assessment of.
 */
export const useEditAssessment = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessment: Assessment) => editAssessment(traineeId, assessment),
    onSuccess: async () => await invalidateAssessmentsQuery(queryClient, traineeId),
  });
};

/**
 * Hook to delete an assessment from a trainee.
 * @param {string} traineeId the id of the trainee to delete the assessment from.
 */
export const useDeleteAssessment = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentId: string) => deleteAssessment(traineeId, assessmentId),
    onSuccess: async () => await invalidateAssessmentsQuery(queryClient, traineeId),
  });
};
