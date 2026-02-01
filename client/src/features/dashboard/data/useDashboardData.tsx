import { DashboardData } from '../Dashboard';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

/**
 * A React Query hook that fetches dashboard data form api for specific dates.
 *
 * @param {string | undefined} startDate
 * @param {string | undefined} endDate
 */
export const useDashboardData = (startDate: string | undefined, endDate: string | undefined) => {
  return useQuery({
    queryKey: ['DashboardInfo'],
    queryFn: async () => {
      const response = await axios.get<DashboardData>(`/api/dashboard?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    },
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};
