import { SearchResult } from '../../models';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const queryKey = 'search-results';

export const useSearchTrainee = (search: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await axios.get(`/api/search?q=${search}&limit=20`);
      console.log(response);
      const trainees: SearchResult[] = response.data.hits.data.map((trainee: SearchResult) => trainee);
      return trainees;
    },
    enabled: search.length > 1, // Query runs only if search string has more than 1 character
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
