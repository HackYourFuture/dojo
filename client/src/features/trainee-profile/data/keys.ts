const TRAINEE_QUERY_KEY = 'trainee';

export const traineeKeys = {
  details: (traineeId: string) => [TRAINEE_QUERY_KEY, 'details', traineeId] as const,
};
