import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { dashboardKeys } from './keys';
import { getDashboard } from '../api/api';

// Keeps the previous numbers on screen while a new cohort range loads.
export const useGetDashboard = (startCohort: number | null, endCohort: number | null) => {
  return useQuery({
    queryKey: dashboardKeys.byRange(startCohort, endCohort),
    queryFn: () => getDashboard(startCohort, endCohort),
    placeholderData: keepPreviousData,
  });
};
