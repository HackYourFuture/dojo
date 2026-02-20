import { useQuery } from '@tanstack/react-query';
import { EmploymentHistory } from '../../../../data/types/Trainee';
import { getEmployments } from '../api/api';

export const employmentHistoryKeys = {
  all: ['employmentHistory'] as const, // for broad invalidation
  byQuery: (traineeId: string) => ['employmentHistory', traineeId] as const,
  // per-term cache
};

/**
 * Hook to get employments of a trainee.
 * @param {string} traineeId the id of the trainee to get the employments from.
 * @returns {UseQueryResult<EmploymentHistory[], Error>} the employments of the trainee.
 */
export const useGetEmploymentHistory = (traineeId: string) => {
  return useQuery({
    queryKey: employmentHistoryKeys.byQuery(traineeId),
    queryFn: async () => {
      const data = await getEmployments(traineeId);
      return orderEmploymentHistoryByDateDesc(data);
    },
    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

const orderEmploymentHistoryByDateDesc = (data: EmploymentHistory[]): EmploymentHistory[] => {
  return data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
};
