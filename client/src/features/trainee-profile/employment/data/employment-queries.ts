import { EmploymentHistory } from '../models/employment-history';
import { employmentHistoryKeys } from './keys';
import { getEmploymentHistory } from '../api/api';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to get employments of a trainee.
 * @param {string} traineeId the id of the trainee to get the employments from.
 * @returns {UseQueryResult<EmploymentHistory[], Error>} the employments of the trainee.
 */
export const useGetEmploymentHistory = (traineeId: string) => {
  return useQuery({
    queryKey: employmentHistoryKeys.list(traineeId),
    queryFn: async () => {
      const data = await getEmploymentHistory(traineeId);
      return orderEmploymentHistoryByDateDesc(data);
    },
    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

const orderEmploymentHistoryByDateDesc = (data: EmploymentHistory[]): EmploymentHistory[] => {
  return data.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
};
