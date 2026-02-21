const TRAINEE_QUERY_KEY = 'traineeInfo';

export const traineeQueryKeys = {
  details: (traineeId: string) => [TRAINEE_QUERY_KEY, 'details', traineeId] as const,
};
