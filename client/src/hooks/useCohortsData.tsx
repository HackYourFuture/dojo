import { Cohort } from '../models';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

/**
 * A React Query hook that fetches cohort data form api for specific dates.
 */
export const useCohortsData = () => {
  return useQuery({
    queryKey: ['CohortsInfo'],
    queryFn: async () => {
      const { data } = await axios.get<Cohort[]>(`/api/cohorts`);
      return data;
    },
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};
