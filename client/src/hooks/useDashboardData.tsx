import { useQuery } from 'react-query';
import axios from 'axios';
import { DashboardData } from '../types';

export const useDashboardData = (
  startDate: string | undefined,
  endDate: string | undefined
) => {
  return useQuery(
    ['DashboardInfo'],
    () => {
      return axios.get<DashboardData>(
        `/api/dashboard?startDate=${startDate}&endDate=${endDate}`
      );
    },
    {
      select: ({ data }) => {
        return data;
      },
      refetchOnWindowFocus: false,
    }
  );
};
