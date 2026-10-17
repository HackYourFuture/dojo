import { getSearchResults } from '../api/api';
import { searchKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

// The API finds nothing for a single letter.
export const MIN_SEARCH_QUERY_LENGTH = 2;

/**
 * Hook to search for trainees.
 * @param {string} query the text typed into the search box.
 */
export const useGetSearchResults = (query: string) => {
  return useQuery({
    queryKey: searchKeys.byQuery(query),
    queryFn: () => getSearchResults(query),
    enabled: query.length >= MIN_SEARCH_QUERY_LENGTH,
    refetchOnMount: false,
  });
};
