import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { TraineeFilters } from '../models/trainee-summary';
import { getTraineeSummaries } from '../api/api';
import { traineeListKeys } from '../data/keys';

// The largest page the API gives, far more trainees than HYF has had, so one page holds them all.
const MAX_PAGE_SIZE = 5000;

/**
 * A React Query hook that fetches every trainee that matches the filters at once, for the map.
 */
export const useGetAllTrainees = (filters: TraineeFilters) => {
  return useQuery({
    // Under the list's key, so the reset after deleting a trainee refreshes the map too.
    queryKey: [...traineeListKeys.list(), 'all', filters],
    queryFn: () => getTraineeSummaries(0, filters, MAX_PAGE_SIZE),
    // The map keeps its markers while the next filter loads.
    placeholderData: keepPreviousData,
  });
};
