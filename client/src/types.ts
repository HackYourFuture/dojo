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

export interface TraineeInfo {
  id: string;
  personalInfo: TraineeData;
  contactInfo: ContactData;

}

export interface TraineeData {
  id: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  gender: string;
  pronouns: string;
  location: string;
  englishLevel: string;
  professionalDutch: string;
  countryOfOrigin: string;
  background: string;
  hasWorkPermit: string;
  residencyStatus: string;
  receivesSocialBenefits: string;
  caseManagerUrging: string;
  educationLevel: string;
  educationBackground: string;
  comments: string;
}

export interface ContactData {
  id: string;
  email: string;
  slack: string;
  phone: string;
  githubHandle: string;
  linkedin: string;
}

export interface ErrorBoxProps {
  errorMessage: string;
}
