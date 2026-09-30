// The kinds of records the search finds.
export enum SearchResultType {
  Trainee = 'trainee',
  Organisation = 'organisation',
  ContactPerson = 'contact-person',
}

export interface SearchResult {
  readonly id: string;
  type: SearchResultType;
  title: string;
  subtitle: string | null;
  thumbnailUrl: string | null;
  path: string;
}
