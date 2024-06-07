// enums
export enum Gender {
  Man = "man",
  Woman = "woman",
  NonBinary = "non-binary",
  Other = "other",
}

export enum EnglishLevel {
  NeedsWork = "needs-work",
  Moderate = "moderate",
  Good = "good",
}

export enum Background {
  Refugee = "refugee",
  FamilyReunification = "family-reunification",
  PartnerOfSkilledMigrant = "partner-of-skilled-migrant",
  VulnerableGroup = "vulnerable-group",
  EUCitizen = "eu-citizen",
}

export enum EducationLevel {
  None = "none",
  HighSchool = "high-school",
  Diploma = "diploma",
  BachelorsDegree = "bachelors-degree",
  MastersDegree = "masters-degree",
}

export enum ResidencyStatus {
  FirstInterview = "first-interview",
  SecondInterview = "second-interview",
  Residency = "residency",
  Citizenship = "citizenship",
}

export enum LearningStatus {
  Studying = "studying",
  Graduated = "graduated",
  OnHold = "on-hold",
  Quit = "quit",
}

export enum StrikeReason {
  LastSubmission = "late-submission",
  MissedSubmission = "missed-submission",
  IncompleteSubmission = "incomplete-submission",
  LateAttendance = "late-attendance",
  Absence = "absence",
  PendingFeedback = "pending-feedback",
  Other = "other",
}

export enum QuitReason {
  Technical = "technical",
  SocialSkills = "social-skills",
  Personal = "personal",
  Withdrawn = "withdrawn",
  MunicipalityOrMonetary = "municipality-or-monetary",
  LeftNL = "left-nl",
  Other = "other",
}

export enum EmploymentType {
  Internship = "internship",
  Job = "job",
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

export enum InteractionType {
  Call = "call",
  Feedback = "feedback",
  TechHour = "tech-hour",
  InPerson = "in-person",
  Other = "other",
}

export enum TestResult {
  Passed = "passed",
  PassedWithWarning = "passed-with-warning",
  Failed = "failed",
  Disqualified = "disqualified",
}

export enum TestType {
  Presentation = "presentation",
  JavaScript = "javascript",
  BrowsersInterview = "browsers-interview",
  UsingApisInterview = "using-apis-interview",
  NodeJS = "nodejs",
  ReactInterview = "react-interview",
  FinalProjectInterview = "final-project-interview",
}

// Props
export interface SearchResultsListProps {
  results: string;
}

export interface SearchBarProps {
  data: Trainee;
}

export interface JobPathProps {
  jobPath: JobPath
}

export interface LearningStatusProps {
  learningStatus: LearningStatus | undefined
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

// interfaces
export interface SearchResult {
  id: number;
  name: string;
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
  createDate: string;
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
