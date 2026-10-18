// The kinds of records the search finds.
export enum SearchResultType {
  Trainee = 'TRAINEE',
  Volunteer = 'VOLUNTEER',
  Organisation = 'ORGANISATION',
  ContactPerson = 'CONTACT_PERSON',
}

export interface SearchResult {
  readonly id: string;
  type: SearchResultType;
  title: string;
  subtitle: string | null;
  thumbnailUrl: string | null;
  path: string;
}
