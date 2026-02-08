export interface SearchResult {
  id: number;
  name: string;
  thumbnail: string | null;
  profilePath: string;
  cohort: number | null;
}

export interface SearchResultResponse {
  hits: {
    data: SearchResult[];
  };
}
