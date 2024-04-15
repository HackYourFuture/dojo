export enum Gender {
  Male = "male",
  Female = "female",
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

export enum EmploymentType {
  Internship = "internship",
  Job = "job",
}

export enum InteractionType {
  Call = "call",
  Feedback = "feedback",
  TechHour = "tech-hour",
  Other = "other",
}

export enum StrikeReason {
  Assignment = "assignment",
  Preparation = "preparation",
  Attendance = "attendance",
  Other = "other",
}

export enum QuitReason {
  Technical = "technical",
  SocialSkills = "social-skills",
  Personal = "personal",
  MunicipalityOrMonetary = "municipality-or-monetary",
  LeftNL = "left-nl",
  Other = "other",
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

export enum LearningStatus {
  Studying = "studying",
  Graduated = "graduated",
  OnHold = "on-hold",
  Quit = "quit",
}

export enum ResidencyStatus {
  FirstInterview = "first-interview",
  SecondInterview = "second-interview",
  Residency = "residency",
  Citizenship = "citizenship",
}

export enum TestResult {
  Passed = "passed",
  PassedWithWarning = "passed-with-warning",
  Failed = "failed",
  Disqualified = "disqualified",
}

export enum TestType {
  JavaScript = "javaScript",
  BrowsersInterview = "browsers-interview",
  UsingApisInterview = "using-apis-interview",
  NodeJS = "nodejs",
  ReactInterview = "react-interview",
  FinalProjectInterview = "final-project-interview",
}

export interface Trainee {
  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  personalInfo: TraineePersonalInfo;
  contactInfo: TraineeContactInfo;
  educationInfo: TraineeEducationInfo;
  employmentInfo: TraineeEmploymentInfo;
  interactions: TraineeInteraction[];
}

export interface TraineeContactInfo {
  email: string;
  slack?: string;
  phone?: string;
  githubHandle?: string;
  linkedin?: string;
}

export interface TraineePersonalInfo {
  firstName: string;
  lastName: string;
  preferredName?: string;
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

export interface Strike {
  readonly _id: string;
  date: Date;
  reporterID: string;
  reason: StrikeReason;
  comments: string;
}

export interface Test {
  readonly _id: string;
  date: Date;
  type: TestType;
  grade?: number;
  result: TestResult;
  comments?: string;
}

export interface Assignment {
  readonly _id: string;
  createDate: Date;
  type: string;
  status: string;
  content?: string;
  comments?: string;
}

export interface TraineeEducationInfo {
  startCohort: number;
  currentCohort?: number;
  learningStatus: LearningStatus;
  startDate?: Date;
  graduationDate?: Date;
  quitReason?: QuitReason;
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
  preferredLocation?: string;
  extraTechnologies?: string;
  employmentHistory: TraineeEmploymentHistory[];
  comments?: string;
}

export interface TraineeEmploymentHistory {
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

export interface TraineeInteraction {
  readonly _id: string;
  date: Date;
  type: InteractionType;
  reporterID: string;
  details: string;
}
