import { SearchResultType } from '../models/search-result';

export interface SearchResultResponse {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string | null;
  thumbnailUrl: string | null;
  path: string;
}
