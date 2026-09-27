const INTERACTIONS_QUERY_KEY = 'interactions';

export const interactionKeys = {
  list: (traineeId: string) => [INTERACTIONS_QUERY_KEY, 'list', traineeId] as const,
};
