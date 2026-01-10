import { EmploymentHistory } from './EmploymentHistory';
import { InteractionWithReporter } from './Interaction';
import { StrikeWithReporter } from './Strike';
import { Test } from './Test';
import removeAccents from 'remove-accents';

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
  PhD = 'phd',
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
  NotSearching = 'not-searching',
  OtherStudies = 'other-studies',
  NoLongerHelping = 'no-longer-helping',
}

export enum LearningStatus {
  Studying = 'studying',
  Graduated = 'graduated',
  OnHold = 'on-hold',
  Quit = 'quit',
}

export enum ResidencyStatus {
  FirstInterview = 'first-interview',
  SecondInterview = 'second-interview',
  Residency = 'residency',
  Citizenship = 'citizenship',
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

export interface Trainee {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  profileURL: string;
  displayName: string;
  imageURL?: string;
  thumbnailURL?: string;
  personalInfo: TraineePersonalInfo;
  contactInfo: TraineeContactInfo;
  educationInfo: TraineeEducationInfo;
  employmentInfo: TraineeEmploymentInfo;
  interactions: InteractionWithReporter[];
}

export interface TraineeContactInfo {
  email: string;
  slackId?: string;
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

export interface Assignment {
  readonly id: string;
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
  techMentor?: string;
  hrMentor?: string;
  engMentor?: string;
  startDate?: Date;
  graduationDate?: Date;
  quitReason?: QuitReason;
  quitDate?: Date;
  strikes: StrikeWithReporter[];
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

export const getDisplayName = (trainee: Trainee): string => {
  const { preferredName, firstName, lastName } = trainee.personalInfo;
  const name: string = preferredName ? preferredName : firstName;
  return `${name} ${lastName}`;
};

export const getProfileURL = (trainee: Trainee): string => {
  const normalizedName = removeAccents(getDisplayName(trainee).toLowerCase()).replaceAll(/\s/g, '-');
  return `${process.env.BASE_URL}/trainee/${normalizedName}_${trainee.id}`;
};

// Validations
export const validateTrainee = (trainee: Trainee): void => {
  validatePersonalInfo(trainee.personalInfo);
  validateContactInfo(trainee.contactInfo);
  validateEducationInfo(trainee.educationInfo);
  validateEmploymentInfo(trainee.employmentInfo);
};

const validatePersonalInfo = (personalInfo: TraineePersonalInfo): void => {
  if (!personalInfo.firstName) {
    throw new Error('First name is required');
  }
  if (!personalInfo.lastName) {
    throw new Error('Last name is required');
  }
  if (!personalInfo.gender) {
    throw new Error('Gender is required');
  }
};

const validateContactInfo = (contactInfo: TraineeContactInfo): void => {
  if (!contactInfo.email) {
    throw new Error('Email is required');
  }
};

const validateEducationInfo = (educationInfo: TraineeEducationInfo): void => {
  if (typeof educationInfo.startCohort !== 'number') {
    throw new Error('Start cohort is required');
  }
  if (!educationInfo.learningStatus) {
    throw new Error('Learning status is required');
  }
};

const validateEmploymentInfo = (employmentInfo: TraineeEmploymentInfo): void => {
  if (!employmentInfo.jobPath) {
    throw new Error('Job path is required');
  }
};
