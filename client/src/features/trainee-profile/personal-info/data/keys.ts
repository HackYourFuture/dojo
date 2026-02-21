const TRAINEE_QUERY_KEY = 'traineeIn';

export const traineeQueryKeys = {
  details: (traineeId: string) => [TRAINEE_QUERY_KEY, 'details', traineeId] as const,
};
