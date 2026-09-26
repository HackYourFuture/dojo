import { SearchResult } from '../models/search-result';
import { SearchResultResponse } from './types';

export const mapSearchResultToDomain = (result: SearchResultResponse): SearchResult => {
  return {
    id: result.id,
    title: result.title,
    subtitle: result.subtitle,
    thumbnailUrl: result.thumbnailUrl,
    path: result.path,
  };
};
