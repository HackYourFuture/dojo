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

export interface SearchResultsListProps {
  results: string;
}

export interface ProfileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface TraineeInfo {
  id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  displayName: string;
  personalInfo: TraineeData;
  contactInfo: ContactData;
  educationInfo: EducationData;
  employmentInfo: EmploymentData;
  interactions: InteractionData[];
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
  slackId: string;
  phone: string;
  githubHandle: string;
  linkedin: string;
}


export interface EducationData {
  startCohort: number;
  currentCohort?: number;
  learningStatus: LearningStatus;
  startDate?: Date;
  graduationDate?: Date;
  // use enum for quitReason when needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quitReason?: any;
  quitDate?: Date;
  strikes: Strike[];
  assignments: Assignment[];
  // use enum for tests when needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tests: any;
  comments?: string;
}

export interface EmploymentData {
  jobPath: JobPath;
  cvURL?: string;
  availability?: string;
  preferredRole?: string;
  drivingLicense?: boolean;
  preferredLocation?: string;
  extraTechnologies?: string;
  employmentHistory: EmploymentHistory[];
  comments?: string;
}

export interface InteractionData {
  readonly _id: string;
  date: Date;
  // use enum for type when needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  reporterID: string;
  details: string;
}

export interface EmploymentHistory {
  readonly _id: string;
  type: EmploymentType;
  companyName: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  feeCollected: boolean;
  feeAmount?: number;
  comments?: string;
}

export interface Strike {
  readonly _id: string;
  date: Date;
  reporterID: string;
  // use enum for reason when needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reason: any;
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

