import { getSearchResults } from '../api/api';
import { searchKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to search for trainees.
 * @param {string} query the text typed into the search box.
 */
export const useGetSearchResults = (query: string) => {
  return useQuery({
    queryKey: searchKeys.byQuery(query),
    queryFn: () => getSearchResults(query),
    enabled: query.length > 1, // Query runs only if search string has more than 1 character
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
