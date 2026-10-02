const DASHBOARD_QUERY_KEY = 'dashboard';

export const dashboardKeys = {
  byRange: (startCohort: number | null, endCohort: number | null) =>
    [DASHBOARD_QUERY_KEY, startCohort, endCohort] as const,
};
