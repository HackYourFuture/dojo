const STRIKES_QUERY_KEY = 'strikes';

export const strikeKeys = {
  list: (traineeId: string) => [STRIKES_QUERY_KEY, 'list', traineeId] as const,
};
