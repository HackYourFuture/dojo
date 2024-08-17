import { AxiosError } from 'axios';

// enums
export enum Gender {
  Man = 'man',
  Woman = 'woman',
  NonBinary = 'non-binary',
  Other = 'other',
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
  LastSubmission = 'late-submission',
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

export enum InteractionType {
  Call = 'call',
  Chat = 'chat',
  Feedback = 'feedback',
  TechHour = 'tech-hour',
  InPerson = 'in-person',
  Other = 'other',
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

// Props
export interface SearchResultsListProps {
  isLoading: boolean;
  data: SearchResult[];
}

export interface SearchBarProps {
  data: Trainee;
}

export interface JobPathProps {
  jobPath: JobPath;
}

export interface LearningStatusProps {
  learningStatus: LearningStatus | undefined;
}

export interface ProfileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface TraineeProfileProps {
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

export interface DashboardPieChartProps {
  chartData: DashboardData;
}

// interfaces
export interface SearchResult {
  id: number;
  name: string;
  thumbnail: string | null;
  cohort: number | null;
}

export interface Trainee {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
  preferredName?: string;
  imageUrl?: string;
  gender: Gender;
  pronouns?: string;
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
  strikes: Strike[];
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
  employmentHistory: TraineeEmploymentHistory[];
  comments?: string;
}

export interface Strike {
  readonly id: string;
  date: Date;
  reporterID: string;
  reason: StrikeReason;
  comments: string;
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

export interface TraineeEmploymentHistory {
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

export interface TraineeInteraction {
  readonly id: string;
  date: Date;
  type: InteractionType;
  reporterID: string;
  details: string;
}

export interface ChartData {
  label: string;
  value: number;
  percent: number;
}

export interface Demographics {
  genderDistribution: ChartData[];
  countryOfOrigin: ChartData[];
}

export interface Program {
  graduations: ChartData[];
  employment: ChartData[];
}

export interface DashboardData {
  demographics: Demographics;
  program: Program;
}
