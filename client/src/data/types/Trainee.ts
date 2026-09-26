// enums
export enum Gender {
  Man = 'man',
  Woman = 'woman',
  NonBinary = 'non-binary',
  Other = 'other',
}

// The pronouns offered in the profile. The API stores pronouns as free text.
export enum Pronouns {
  HeHim = 'He/him',
  SheHer = 'She/her',
  TheyThem = 'They/them',
  HeThey = 'He/they',
  SheThey = 'She/they',
}

export enum EnglishLevel {
  NeedsWork = 'needs-work',
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
  PhD = 'phd',
}

export enum LearningStatus {
  Studying = 'studying',
  Graduated = 'graduated',
  OnHold = 'on-hold',
  Quit = 'quit',
}

export enum Track {
  Frontend = 'frontend',
  Backend = 'backend',
  Data = 'data',
  Tester = 'tester',
  Cloud = 'cloud',
  CoreProgram = 'core-program',
  FullstackLegacy = 'fullstack-legacy',
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

export enum JobPath {
  NotGraduated = 'not-graduated',
  Searching = 'searching',
  Internship = 'internship',
  TechJob = 'tech-job',
  NonTechJob = 'non-tech-job',
  OtherStudies = 'other-studies',
  SupportEnded = 'support-ended',
}

// interfaces
export interface Trainee {
  readonly id: string;
  displayName: string;
  profilePath: string;
  pictureUrl: string | null;
  thumbnailUrl: string | null;
  personalInfo: TraineePersonalInfo;
  contactInfo: TraineeContactInfo;
  educationInfo: TraineeEducationInfo;
  employmentInfo: TraineeEmploymentInfo;
}

export interface TraineePersonalInfo {
  firstName: string;
  lastName: string;
  preferredName: string | null;
  gender: Gender | null;
  pronouns: string | null;
  location: string | null;
  englishLevel: EnglishLevel | null;
  professionalDutch: boolean | null;
  countryOfOrigin: string | null;
  background: Background | null;
  educationLevel: EducationLevel | null;
  educationBackground: string | null;
  comments: string | null;
}

export interface TraineeContactInfo {
  email: string;
  slackId: string | null;
  phone: string | null;
  githubHandle: string | null;
  linkedinUrl: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

// Dates are YYYY-MM-DD strings, the format of both the API and the date inputs.
export interface TraineeEducationInfo {
  startCohort: number;
  currentCohort: number | null;
  learningStatus: LearningStatus;
  track: Track;
  mentorTech: string | null;
  mentorHr: string | null;
  mentorEnglish: string | null;
  startDate: string | null;
  graduationDate: string | null;
  quitReason: QuitReason | null;
  quitDate: string | null;
}

export interface TraineeEmploymentInfo {
  jobPath: JobPath;
}

export type TraineeInfoType = 'personalInfo' | 'contactInfo' | 'employmentInfo' | 'educationInfo';

// The fields edited on the profile page, grouped by tab.
export type TraineeChanges = { [K in TraineeInfoType]?: Partial<Trainee[K]> };

export interface NewTrainee {
  firstName: string;
  lastName: string;
  gender: Gender | null;
  email: string;
  cohort: number;
  learningStatus: LearningStatus;
  jobPath: JobPath;
}
