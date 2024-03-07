export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum EnglishLevel {
  NeedsWork = "needs-work",
  Medium = "medium",
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
  LateSubmission = "late-submission",
  NoPrepExercise = "no-prep-exercise",
  NoQuestion = "no-question",
  Presence = "presence",
  Other = "other",
}

export interface Trainee {
  readonly id: string;
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
  github?: string;
  linkedin?: string;
}

export interface TraineePersonalInfo {
  firstName: string;
  lastName: string;
  gender: Gender;
  pronouns?: string;
  location?: string;
  englishLevel?: EnglishLevel;
  professionalDutch?: boolean;
  imageUrl?: string;
  countryOfOrigin?: string;
  background?: Background;
  hasWorkPermit?: boolean;
  receivesUitkering?: boolean;
  caseManagerPressing?: boolean;
  educationLevel?: EducationLevel;
  educationBackground?: string;
  comments?: string;
}

export interface Strike {
  createDate: Date;
  strikeDate: Date;
  reporterID: string;
  reason: StrikeReason;
  comments?: string;
}

export interface Test {
  testDate: Date;
  type: string;
  grade?: number;
  pass: Boolean;
  warning: Boolean;
  comments?: string;
}

export interface Assignment {
  createDate: Date;
  type: string;
  status: string;
  content?: string;
  comments?: string;
}

export interface TraineeEducationInfo {
  startCohort?: number;
  currentCohort?: number;
  learningStatus: string;
  startDate?: Date;
  graduationDate?: Date;
  quitReason?: string;
  strikes: Strike[];
  assignments: Assignment[];
  tests: Test[];
  comments?: string;
}

export interface TraineeEmploymentInfo {
  status?: string;
  cvURL?: string;
  availability?: string;
  preferredRole?: string;
  preferredLocation?: string;
  extraTechnologies?: string;
  employmentHistory: TraineeEmploymentHistory[];
  comments?: string;
}

export interface TraineeEmploymentHistory {
  type: EmploymentType;
  companyName: string;
  startDate: Date;
  endDate?: Date;
  role: string;
  feeCollected: boolean;
  feeAmount?: number;
  comments?: string;
}

export interface TraineeInteraction {
  createDate: Date;
  type: InteractionType;
  reporterID: string;
  details: string;
}
