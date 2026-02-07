import { useQuery } from '@tanstack/react-query';
import { getCohorts } from '../api/api';

/**
 * A React Query hook that fetches cohort data form api for specific dates.
 */
export const useCohortsData = () => {
  return useQuery({
    queryKey: ['CohortsInfo'],
    queryFn: getCohorts,
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};
