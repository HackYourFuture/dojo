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

export interface Trainee {
  id: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  personalInfo: TraineePersonalInfo;
  contactInfo: TraineeContactInfo;
  educationInfo: TraineeEducationInfo;
  employmentInfo: TraineeEmploymentInfo;
  interactions: TraineeInteraction[];
}

export interface TraineePersonalInfo {
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

export interface TraineeContactInfo {
  email: string;
  slackId: string;
  phone: string;
  githubHandle: string;
  linkedin: string;
}

export interface TraineeEducationInfo {
  startCohort: number;
  currentCohort: number;
  learningStatus: string;
  startDate: string;
  graduationDate: string;
  quitReason: string;
  strikes: Strike;
  assignments: Assignment;
  tests: Test;
  comments: string;
}

export interface TraineeEmploymentInfo {
  jobPath: string;
  cvURL: string;
  availability: string;
  preferredRole: string;
  preferredLocation: string;
  extraTechnologies: string;
  employmentHistory: TraineeEmploymentHistory[];
  comments: string;
}

export interface Strike {
  id: string;
  date: string;
  reporterID: string;
  reason: string;
  comments: string;
}

export interface Assignment {
  createDate: string;
  type: string;
  status: string;
  content: string;
  comments: string;
}

export interface Test {
  id: string;
  date: string;
  type: string;
  grade: number;
  result: string;
  comments: string;
}

export interface TraineeEmploymentHistory {
  id: string;
  type: string;
  companyName: string;
  role: string;
  startDate: string;
  endDate: string;
  feeCollected: boolean;
  feeAmount: number;
  comments: string;
}

export interface TraineeInteraction {
  type: string;
  reporterID: string;
  createDate: string;
  details: string;
}
