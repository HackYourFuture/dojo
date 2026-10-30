import { EducationLevel, LearningStatus } from '../../../data/types/Trainee';

// The label of a missing value, like a trainee without a gender.
export const NOT_SPECIFIED = 'Not specified';

export interface LabelCount {
  label: string;
  count: number;
}

export interface LearningStatusCount {
  status: LearningStatus;
  count: number;
}

export interface EducationLevelCount extends LabelCount {
  educationLevel: EducationLevel | null;
}

export interface Overview {
  studying: number;
  onHold: number;
  searching: number;
  active: number;
  workingInIt: number;
  leftWithoutItJob: number;
  total: number;
}

export interface DashboardData {
  overview: Overview;
  learningStatuses: LearningStatusCount[];
  tracks: LabelCount[];
  educationLevels: EducationLevelCount[];
  countries: LabelCount[];
  // The trainees without a country of origin, left out of the countries.
  countriesNotSpecified: number;
  genders: LabelCount[];
}
