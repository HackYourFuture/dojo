import { Cohort, TraineeFilters, TraineeSummary } from '../models/trainee-summary';
import { InfiniteData, keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Page, getLoadedItemsAndTotal, getNextPageParam } from '../../../data/pagination';
import { getTraineeSummaries, searchTrainees } from '../api/api';

import { LearningStatus } from '../../../data/types/Trainee';
import { traineeListKeys } from './keys';

// The search finds nothing useful for a single letter.
export const MIN_TRAINEE_QUERY_LENGTH = 2;

const LEARNING_STATUS_ORDER = [
  LearningStatus.Studying,
  LearningStatus.Graduated,
  LearningStatus.OnHold,
  LearningStatus.Quit,
];

const compareTrainees = (a: TraineeSummary, b: TraineeSummary) => {
  const statusOrder = LEARNING_STATUS_ORDER.indexOf(a.learningStatus) - LEARNING_STATUS_ORDER.indexOf(b.learningStatus);
  return statusOrder || a.displayName.localeCompare(b.displayName);
};

/**
 * Groups the loaded pages by cohort, keeping the server's order of the cohorts, with the size of the whole list.
 * Defined outside the hook so that React Query only runs it when the pages change.
 */
const selectCohorts = (data: InfiniteData<Page<TraineeSummary>>): { cohorts: Cohort[]; total: number } => {
  const { items, total } = getLoadedItemsAndTotal(data);
  const cohorts = new Map<number | null, TraineeSummary[]>();

  for (const trainee of items) {
    const cohort = cohorts.get(trainee.cohort);
    if (cohort) {
      cohort.push(trainee);
    } else {
      cohorts.set(trainee.cohort, [trainee]);
    }
  }

  return {
    cohorts: Array.from(cohorts, ([cohort, trainees]) => ({ cohort, trainees: trainees.sort(compareTrainees) })),
    total,
  };
};

/**
 * A React Query hook that fetches the trainees that match the filters page by page and groups them by cohort.
 */
export const useGetTraineesByCohort = (filters: TraineeFilters) => {
  return useInfiniteQuery({
    queryKey: traineeListKeys.filteredList(filters),
    queryFn: ({ pageParam }) => getTraineeSummaries(pageParam, filters),
    initialPageParam: 0,
    getNextPageParam,
    select: selectCohorts,
    // The list stays on screen while the next filter loads.
    placeholderData: keepPreviousData,
  });
};

/** Hook to find trainees for a picker: the first page of the search, newest cohort first. */
export const useSearchTrainees = (query: string) => {
  return useQuery({
    queryKey: traineeListKeys.search(query),
    queryFn: () => searchTrainees(query),
    enabled: query.length >= MIN_TRAINEE_QUERY_LENGTH,
  });
};
