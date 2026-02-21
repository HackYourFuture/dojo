const INTERACTIONS_QUERY_KEY = 'interactions';

export const interactionsQueryKeys = {
  list: (traineeId: string) => [INTERACTIONS_QUERY_KEY, 'list', traineeId] as const,
};
