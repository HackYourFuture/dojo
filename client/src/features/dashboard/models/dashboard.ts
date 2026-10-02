import { LearningStatus } from '../../../data/types/Trainee';

export interface LabelCount {
  label: string;
  count: number;
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
  learningStatuses: { status: LearningStatus; count: number }[];
  tracks: LabelCount[];
  educationLevels: LabelCount[];
  countries: LabelCount[];
  genders: LabelCount[];
}
