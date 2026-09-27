const SEARCH_QUERY_KEY = 'search';

export const searchKeys = {
  byQuery: (query: string) => [SEARCH_QUERY_KEY, query.toLowerCase()] as const,
};
