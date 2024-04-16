export interface SearchResult {
  id: number;
  name: string;
}

export interface SearchResultsListProps {
  results: string;
}

export interface ProfileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}