import { SearchResult } from '../Search';
import axios from 'axios';
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
      const response = await axios.get(`/api/search?q=${query}&limit=20`);
      const trainees: SearchResult[] = response.data.hits.data.map((trainee: SearchResult) => trainee);
      return trainees;
    },
    enabled: query.length > 1, // Query runs only if search string has more than 1 character
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

interface SearchResultResponse {
  hits: {
    data: SearchResult[];
  };
}
export const getSearchResults = async (query: string): Promise<SearchResult[]> => {
  const response = await axios.get<SearchResultResponse>(`/api/search?q=${query}&limit=20`);
  return response.data.hits.data;
};
