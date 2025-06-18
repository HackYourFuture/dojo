import { LearningStatus } from './Trainee';

export interface Cohort {
  cohort: number | null;
  trainees: TraineeSummary[];
}

export interface TraineeSummary {
  id: string;
  displayName: string;
  profileURL: string;
  thumbnailURL: string | null;
  location?: string;
  hasWorkPermit?: boolean;
  email: string;
  slackID?: string;
  githubHandle?: string;
  linkedIn?: string;
  LearningStatus: LearningStatus;
  JobPath: string;
  strikes: number;
}
