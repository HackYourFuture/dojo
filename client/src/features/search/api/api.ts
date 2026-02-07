import axios from 'axios';
import { SearchResult, SearchResultResponse } from '../Search';

export const getSearchResults = async (query: string): Promise<SearchResult[]> => {
  const response = await axios.get<SearchResultResponse>(`/api/search?q=${query}&limit=20`);
  return response.data.hits.data;
};
