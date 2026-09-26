import { dashboardKeys } from './keys';
import { getDashboard } from '../api/api';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to get the dashboard data for a date range.
 *
 * @param {string | undefined} startDate
 * @param {string | undefined} endDate
 */
export const useGetDashboard = (startDate: string | undefined, endDate: string | undefined) => {
  return useQuery({
    queryKey: dashboardKeys.details(),
    queryFn: () => getDashboard(startDate, endDate),
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};
