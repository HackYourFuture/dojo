import { Interaction } from './Interactions';

// enums
export enum Gender {
  Man = 'man',
  Woman = 'woman',
  NonBinary = 'non-binary',
  Other = 'other',
}

export enum Pronouns {
  HeHim = 'He/him',
  SheHer = 'She/her',
  TheyThem = 'They/them',
  HeThey = 'He/they',
  SheThey = 'She/they',
}

export enum EnglishLevel {
  NeedsWork = 'needs-work',
  Moderate = 'moderate',
  Good = 'good',
}

export enum Background {
  Refugee = 'refugee',
  FamilyReunification = 'family-reunification',
  PartnerOfSkilledMigrant = 'partner-of-skilled-migrant',
  VulnerableGroup = 'vulnerable-group',
  EUCitizen = 'eu-citizen',
}

export enum EducationLevel {
  None = 'none',
  HighSchool = 'high-school',
  Diploma = 'diploma',
  BachelorsDegree = 'bachelors-degree',
  MastersDegree = 'masters-degree',
}

export enum ResidencyStatus {
  FirstInterview = 'first-interview',
  SecondInterview = 'second-interview',
  Residency = 'residency',
  Citizenship = 'citizenship',
}

export enum LearningStatus {
  Studying = 'studying',
  Graduated = 'graduated',
  OnHold = 'on-hold',
  Quit = 'quit',
}

export enum StrikeReason {
  LateSubmission = 'late-submission',
  MissedSubmission = 'missed-submission',
  IncompleteSubmission = 'incomplete-submission',
  LateAttendance = 'late-attendance',
  Absence = 'absence',
  PendingFeedback = 'pending-feedback',
  Other = 'other',
}

export enum QuitReason {
  Technical = 'technical',
  SocialSkills = 'social-skills',
  Personal = 'personal',
  Withdrawn = 'withdrawn',
  MunicipalityOrMonetary = 'municipality-or-monetary',
  LeftNL = 'left-nl',
  Other = 'other',
}

export enum EmploymentType {
  Internship = 'internship',
  Job = 'job',
}

export enum JobPath {
  NotGraduated = 'not-graduated',
  Searching = 'searching',
  Internship = 'internship',
  TechJob = 'tech-job',
  NonTechJob = 'non-tech-job',
  NotSearching = 'not-searching',
  OtherStudies = 'other-studies',
  NoLongerHelping = 'no-longer-helping',
}

export enum TestResult {
  Passed = 'passed',
  PassedWithWarning = 'passed-with-warning',
  Failed = 'failed',
  Disqualified = 'disqualified',
}

export enum TestType {
  Presentation = 'presentation',
  JavaScript = 'javascript',
  BrowsersInterview = 'browsers-interview',
  UsingApisInterview = 'using-apis-interview',
  NodeJS = 'nodejs',
  ReactInterview = 'react-interview',
  FinalProjectInterview = 'final-project-interview',
}

// interfaces
export interface Trainee {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  displayName: string;
  imageURL?: string;
  thumbnailURL?: string;
  personalInfo: TraineePersonalInfo;
  contactInfo: TraineeContactInfo;
  educationInfo: TraineeEducationInfo;
  employmentInfo: TraineeEmploymentInfo;
  interactions: Interaction[];
}

export interface TraineePersonalInfo {
  firstName: string;
  lastName: string;
  preferredName?: string;
  gender: Gender;
  pronouns?: Pronouns;
  location?: string;
  englishLevel?: EnglishLevel;
  professionalDutch?: boolean;
  countryOfOrigin?: string;
  background?: Background;
  hasWorkPermit?: boolean;
  residencyStatus?: ResidencyStatus;
  receivesSocialBenefits?: boolean;
  caseManagerUrging?: boolean;
  educationLevel?: EducationLevel;
  educationBackground?: string;
  comments?: string;
}

export interface TraineeContactInfo {
  email: string;
  slackId?: string;
  phone?: string;
  githubHandle?: string;
  linkedin?: string;
}

export interface TraineeEducationInfo {
  startCohort: number;
  currentCohort?: number;
  learningStatus: LearningStatus;
  startDate?: Date;
  graduationDate?: Date;
  quitReason?: QuitReason;
  quitDate?: Date;
  assignments: Assignment[];
  tests: Test[];
  comments?: string;
}

export interface TraineeEmploymentInfo {
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

export interface Strike {
  readonly id: string;
  date: Date;
  reporterID: string;
  reason: StrikeReason | null;
  comments: string;
  reporter: ReporterWithId;
}

export interface Assignment {
  readonly id: string;
  createDate: Date;
  type: string;
  status: string;
  content?: string;
  comments?: string;
}

export interface Test {
  readonly id: string;
  date: Date;
  type: TestType;
  grade?: number;
  result: TestResult;
  comments?: string;
}

export interface EmploymentHistory {
  readonly id: string;
  type: EmploymentType;
  companyName: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  feeCollected: boolean;
  feeAmount?: number;
  comments?: string;
}

export interface Reporter {
  name: string;
  imageUrl: string;
}

export interface ReporterWithId extends Reporter {
  id: string;
}

export type TraineeInfoType = 'personalInfo' | 'contactInfo' | 'employmentInfo' | 'educationInfo';
