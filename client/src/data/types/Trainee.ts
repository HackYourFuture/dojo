import { City } from '../../features/geo/models/city';
import { Gender } from './Person';

// enums
export enum EnglishLevel {
  NeedsWork = 'NEEDS_WORK',
  Good = 'GOOD',
}

export enum Background {
  Refugee = 'REFUGEE',
  FamilyReunification = 'FAMILY_REUNIFICATION',
  PartnerOfSkilledMigrant = 'PARTNER_OF_SKILLED_MIGRANT',
  VulnerableGroup = 'VULNERABLE_GROUP',
  EUCitizen = 'EU_CITIZEN',
}

export enum FinancialSupport {
  SideJob = 'SIDE_JOB',
  Uitkering = 'UITKERING',
  Family = 'FAMILY',
  Savings = 'SAVINGS',
  None = 'NONE',
}

export enum EducationLevel {
  None = 'NONE',
  HighSchool = 'HIGH_SCHOOL',
  Diploma = 'DIPLOMA',
  BachelorsDegree = 'BACHELORS_DEGREE',
  MastersDegree = 'MASTERS_DEGREE',
  PhD = 'PHD',
}

export enum LearningStatus {
  Studying = 'STUDYING',
  Graduated = 'GRADUATED',
  OnHold = 'ON_HOLD',
  Quit = 'QUIT',
}

export enum Track {
  CoreProgram = 'CORE_PROGRAM',
  Frontend = 'FRONTEND',
  Backend = 'BACKEND',
  Data = 'DATA',
  Tester = 'TESTER',
  Cloud = 'CLOUD',
  FullstackLegacy = 'FULLSTACK_LEGACY',
}

export enum QuitReason {
  Technical = 'TECHNICAL',
  SocialSkills = 'SOCIAL_SKILLS',
  Personal = 'PERSONAL',
  Withdrawn = 'WITHDRAWN',
  MunicipalityOrMonetary = 'MUNICIPALITY_OR_MONETARY',
  LeftNL = 'LEFT_NL',
  Other = 'OTHER',
}

export enum JobPath {
  NotGraduated = 'NOT_GRADUATED',
  Searching = 'SEARCHING',
  Internship = 'INTERNSHIP',
  TechJob = 'TECH_JOB',
  NonTechJob = 'NON_TECH_JOB',
  OtherStudies = 'OTHER_STUDIES',
  SupportEnded = 'SUPPORT_ENDED',
}

// interfaces
// Dates are YYYY-MM-DD strings, the format of both the API and the date inputs.
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
  dateOfBirth: string | null;
  city: City | null;
  englishLevel: EnglishLevel | null;
  professionalDutch: boolean | null;
  countryOfOrigin: string | null;
  background: Background | null;
  nlArrivalDate: string | null;
  firstPermitIssueDate: string | null;
  financialSupport: FinancialSupport | null;
  educationLevel: EducationLevel | null;
  educationBackground: string | null;
  weeklyWorkHours: number | null;
  dietaryPreference: string | null;
  healthCondition: string | null;
  comments: string | null;
  esfId: string | null;
}

export interface TraineeContactInfo {
  email: string;
  slackId: string | null;
  phone: string | null;
  githubHandle: string | null;
  linkedinUrl: string | null;
  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactPhone: string | null;
}

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
  jobSupportEndDate: string | null;
  hasCar: boolean | null;
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
