import { Cohort, TraineeSummary, TraineeSummaryPage } from '../models/cohort';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { LearningStatus } from '../../../data/types/Trainee';
import { cohortKeys } from './keys';
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
const selectCohorts = (data: InfiniteData<TraineeSummaryPage>): Cohort[] => {
  const cohorts = new Map<number | null, TraineeSummary[]>();
  const seenIds = new Set<string>();

  for (const trainee of data.pages.flatMap((page) => page.trainees)) {
    // Pages are fetched by offset, so a trainee added or removed while scrolling can repeat a row.
    if (seenIds.has(trainee.id)) continue;
    seenIds.add(trainee.id);

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
export const useGetCohorts = () => {
  return useInfiniteQuery({
    queryKey: cohortKeys.list(),
    queryFn: ({ pageParam }) => getTraineeSummaries(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam + 1 < lastPage.totalPages ? lastPageParam + 1 : undefined,
    select: selectCohorts,
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};
