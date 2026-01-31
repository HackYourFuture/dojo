import axios, { AxiosError } from 'axios';

import { SearchResult } from '../../models';
import { useQuery } from '@tanstack/react-query';

export const searchKeys = {
  all: ['search'] as const, // for broad invalidation
  byQuery: (query: string) => ['search', query.toLowerCase()] as const,
  // per-term cache
};

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: searchKeys.byQuery(query),
    queryFn: async () => {
      // TODO: extract URL to an api.ts
      const response = await axios.get(`/api/search?q=${query}&limit=20`);
      const trainees: SearchResult[] = response.data.hits.data.map((trainee: SearchResult) => trainee);
      return trainees;
    },
    enabled: query.length > 1, // Query runs only if search string has more than 1 character
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
