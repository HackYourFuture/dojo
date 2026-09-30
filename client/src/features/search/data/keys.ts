const SEARCH_QUERY_KEY = 'search';

export const searchKeys = {
  all: () => [SEARCH_QUERY_KEY] as const,
  byQuery: (query: string) => [SEARCH_QUERY_KEY, query.toLowerCase()] as const,
};
