import { TraineeFilters } from '../models/trainee-summary';

const TRAINEES_QUERY_KEY = 'trainees';

export const traineeListKeys = {
  // Also matches every filtered list, so resetting it resets them all.
  list: () => [TRAINEES_QUERY_KEY, 'list'] as const,
  filteredList: (filters: TraineeFilters) => [TRAINEES_QUERY_KEY, 'list', filters] as const,
  // Under the list's key, so the reset after deleting a trainee clears the picker's results too.
  search: (query: string) => [TRAINEES_QUERY_KEY, 'list', 'search', query.toLowerCase()] as const,
};
