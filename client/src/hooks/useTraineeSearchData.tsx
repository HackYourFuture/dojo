import { SearchResult } from '../models';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// /**
//  * A React Query hook that fetches trainee search results form api.
//  *
//  * @param {string} search search keyword
//  */
// export const useTraineeSearchData = (search: string) => {
//   return useQuery(
//     {
//       queryKey: ['search-results', search],
//     }
//     ['search-results', search],
//     () => {
//       return axios.get(`/api/search?q=${search}&limit=20`);
//     },
//     {
//       enabled: search.length > 1, // Query runs only if search string has more than 1 character
//       select: (response) => {
//         const trainees: SearchResult[] = response.data.hits.data.map((trainee: SearchResult) => trainee);
//         return trainees;
//       },
//     }
//   );
// };
