export interface Trainee {
  readonly id: string;
  personalInfo: TraineePersonalInfo;
  contactInfo: TraineeContactInfo;
  educationInfo: TraineeEducationInfo;
  employmentInfo: TraineeEmploymentInfo;
  interactions: TraineeInteraction[];
}

export interface TraineeContactInfo {
  slack?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
}

export interface TraineePersonalInfo {
  firstName: string;
  lastName: string;
  gender?: string;
  location?: string;
  englishLevel?: string;
  professionalDutch?: boolean;
  imageUrl?: string;
  countryOfOrigin?: string;
  hasWorkPermit?: boolean;
  hasUitkering?: boolean;
  caseManagerPressing?: boolean;
  educationLevel?: string;
  comments?: string;
}

export interface Strike {
  createDate: Date;
  strikeDate: Date;
  reporterID: string;
  reason: string;
  comments?: string;
}

export interface Test {
  testDate: Date;
  type: string;
  grade: number;
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
  startCohort: number;
  currentCohort: number;
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
  status: string;
  professionalBackground?: string;
  cvURL?: string;
  availability?: string;
  preferredRole?: string;
  employmentHistory: TraineeEmploymentHistory[];
  comments?: string;
}

export interface TraineeEmploymentHistory {
  type: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  role: string;
  feeCollected?: boolean;
  feeAmount?: number;
  comments?: string;
}

export interface TraineeInteraction {
  type: string;
  reporterID: string;
  date: Date;
  details: string;
}
