const ASSESSMENTS_QUERY_KEY = 'assessments';

export const assessmentKeys = {
  list: (traineeId: string) => [ASSESSMENTS_QUERY_KEY, 'list', traineeId] as const,
};
