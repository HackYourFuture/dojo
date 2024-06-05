// enums
export enum LearningStatus {
  Studying = "studying",
  Graduated = "graduated",
  OnHold = "on-hold",
  Quit = "quit",
}

export enum JobPath {
  NotGraduated = "not-graduated",
  Searching = "searching",
  Internship = "internship",
  TechJob = "tech-job",
  NonTechJob = "non-tech-job",
  NotSearching = "not-searching",
  OtherStudies = "other-studies",
  NoLongerHelping = "no-longer-helping",
}

export enum EmploymentType {
  Internship = "internship",
  Job = "job",
}

// interfaces
export interface SearchResult {
  id: number;
  name: string;
}

export interface SearchResultsListComponentProps {
  results: string;
}

export interface SearchBarComponentProps {
  data: Trainee;
}

export interface JobPathComponentProps {
  jobPath: JobPath
}

export interface LearningPathComponentProps {
  learningStatus: LearningStatus | undefined
}

export interface ProfileNavComponentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface TraineePageProps {
  id: string;
}

export interface ProfileSidebarProps {
  traineeId: string;
}

export interface PersonalInfoProps {
  traineeData?: TraineePersonalInfo;
  saveTraineeData: (editedData: TraineePersonalInfo) => void;
}

export interface ContactInfoProps {
  contactData?: TraineeContactInfo;
  saveTraineeData: (editedData: TraineeContactInfo) => void;
}

export interface EducationInfoProps {
  educationData?: TraineeEducationInfo;
  saveTraineeData: (editedData: TraineeEducationInfo) => void;
}

export interface EmploymentInfoProps {
  employmentData?: TraineeEmploymentInfo;
  saveTraineeData: (editedData: TraineeEmploymentInfo) => void;
}

export interface Trainee {
  id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  displayName: string;
  personalInfo: TraineePersonalInfo;
  contactInfo: TraineeContactInfo;
  educationInfo: TraineeEducationInfo;
  employmentInfo: TraineeEmploymentInfo;
  interactions: TraineeInteraction[];
}

export interface TraineePersonalInfo {
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

export interface TraineeContactInfo {
  id: string;
  email: string;
  slackId: string;
  phone: string;
  githubHandle: string;
  linkedin: string;
}

export interface TraineeEducationInfo {
  id: string;
  startCohort: number;
  currentCohort: number;
  learningStatus: LearningStatus;
  startDate: string;
  graduationDate: string;
  quitReason: string;
  quitDate: string;
  strikes: Strike[];
  assignments: Assignment[];
  tests: Test[];
  comments: string;
}

export interface TraineeEmploymentInfo {
  id: string;
  jobPath: JobPath;
  cvURL: string;
  availability: string;
  preferredRole: string;
  preferredLocation: string;
  drivingLicense: string;
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
  readonly _id: string;
  createDate: Date;
  type: string;
  status: string;
  content?: string;
  comments?: string;
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
