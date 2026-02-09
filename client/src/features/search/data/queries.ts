import { useQuery } from '@tanstack/react-query';
import { getSearchResults } from '../api/api';

export const searchKeys = {
  all: ['search'] as const, // for broad invalidation
  byQuery: (query: string) => ['search', query.toLowerCase()] as const,
  // per-term cache
};

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: searchKeys.byQuery(query),
    queryFn: () => getSearchResults(query),
    enabled: query.length > 1, // Query runs only if search string has more than 1 character
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
