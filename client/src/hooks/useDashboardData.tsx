import { useQuery } from 'react-query';
import axios from 'axios';
import { DashboardData } from '../types';

/**
 * A React Query hook that fetches dashboard data form api for specific dates.
 *
 * @param {string | undefined} startDate
 * @param {string | undefined} endDate
 */
export const useDashboardData = (startDate: string | undefined, endDate: string | undefined) => {
  return useQuery(
    ['DashboardInfo'],
    () => {
      return axios.get<DashboardData>(`/api/dashboard?startDate=${startDate}&endDate=${endDate}`);
    },
    {
      select: ({ data }) => {
        return data;
      },
      refetchOnWindowFocus: false, // Prevent refetching on window focus
    }
  );
};
