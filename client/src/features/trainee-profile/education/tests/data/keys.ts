const TESTS_QUERY_KEY = 'tests';

export const testsQueryKeys = {
  list: (traineeId: string) => [TESTS_QUERY_KEY, 'list', traineeId] as const,
};
