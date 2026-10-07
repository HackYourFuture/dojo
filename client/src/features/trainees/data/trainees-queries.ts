import { Cohort, TraineeSummary } from '../models/trainee-summary';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { Page, getLoadedItems, getNextPageParam } from '../../../data/pagination';

import { LearningStatus } from '../../../data/types/Trainee';
import { traineeListKeys } from './keys';
import { getTraineeSummaries } from '../api/api';

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
 * Groups the loaded pages by cohort, keeping the server's order of the cohorts.
 * Defined outside the hook so that React Query only runs it when the pages change.
 */
const selectCohorts = (data: InfiniteData<Page<TraineeSummary>>): Cohort[] => {
  const cohorts = new Map<number | null, TraineeSummary[]>();

  for (const trainee of getLoadedItems(data)) {
    const cohort = cohorts.get(trainee.cohort);
    if (cohort) {
      cohort.push(trainee);
    } else {
      cohorts.set(trainee.cohort, [trainee]);
    }
  }

  return Array.from(cohorts, ([cohort, trainees]) => ({ cohort, trainees: trainees.sort(compareTrainees) }));
};

/**
 * A React Query hook that fetches the trainees page by page and groups them by cohort.
 */
export const useGetTraineesByCohort = () => {
  return useInfiniteQuery({
    queryKey: traineeListKeys.list(),
    queryFn: ({ pageParam }) => getTraineeSummaries(pageParam),
    initialPageParam: 0,
    getNextPageParam,
    select: selectCohorts,
  });
};
