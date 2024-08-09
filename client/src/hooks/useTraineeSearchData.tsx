import { useQuery } from 'react-query';
import axios from 'axios';
import { SearchResult } from '../types';

/**
 * A React Query hook that fetches trainee search results form api.
 *
 * @param {string} search search keyword
 */
export const useTraineeSearchData = (search: string) => {
  return useQuery(
    ['search-results', search],
    () => {
      return axios.get(`/api/search?q=${search}&limit=20`);
    },
    {
      select: (data) => {
        const trainees = data.data.hits.data.map((trainee: SearchResult) => trainee);
        return trainees;
      },
    }
  );
};
