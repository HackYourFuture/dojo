export interface SearchResult {
  readonly id: string;
  title: string;
  subtitle: string | null;
  thumbnailUrl: string | null;
  path: string;
}
