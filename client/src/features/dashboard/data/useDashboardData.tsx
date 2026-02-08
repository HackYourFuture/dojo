import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../api/api';

/**
 * A React Query hook that fetches dashboard data from api for specific dates.
 *
 * @param {string | undefined} startDate
 * @param {string | undefined} endDate
 */
export const useDashboardData = (startDate: string | undefined, endDate: string | undefined) => {
  return useQuery({
    queryKey: ['DashboardInfo'],
    queryFn: () => getDashboardData(startDate, endDate),
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};
