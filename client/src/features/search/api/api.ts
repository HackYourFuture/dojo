import { SearchResultResponse } from './types';
import axios from 'axios';
import { mapSearchResultToDomain } from './mapper';

export const getSearchResults = async (query: string) => {
  const { data } = await axios.get<SearchResultResponse[]>('/api/search', { params: { q: query } });
  return data.map((result) => mapSearchResultToDomain(result));
};
