const ORGANISATIONS_QUERY_KEY = 'organisations';

export const organisationKeys = {
  list: () => [ORGANISATIONS_QUERY_KEY, 'list'] as const,
  details: (organisationId: string) => [ORGANISATIONS_QUERY_KEY, 'details', organisationId] as const,
};
