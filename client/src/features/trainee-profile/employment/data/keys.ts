const EMPLOYMENT_HISTORY_QUERY_KEY = 'employmentHistory';

export const employmentHistoryKeys = {
  list: (traineeId: string) => [EMPLOYMENT_HISTORY_QUERY_KEY, 'list', traineeId] as const,
};
