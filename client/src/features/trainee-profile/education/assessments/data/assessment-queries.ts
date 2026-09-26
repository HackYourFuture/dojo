import { Assessment } from '../models/assessment';
import { assessmentKeys } from './keys';
import { getAssessments } from '../api/api';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to get the assessments of a trainee.
 * @param {string} traineeId the id of the trainee to get the assessments from.
 * @returns {UseQueryResult<Assessment[], Error>} the assessments of the trainee.
 */
export const useGetAssessments = (traineeId: string) => {
  return useQuery({
    queryKey: assessmentKeys.list(traineeId),
    queryFn: async () => {
      const assessments = await getAssessments(traineeId);
      return orderAssessmentsByDateDesc(assessments);
    },
    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

const orderAssessmentsByDateDesc = (data: Assessment[]): Assessment[] => {
  return data.sort((a, b) => b.date.getTime() - a.date.getTime());
};
