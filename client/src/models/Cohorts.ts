export interface Cohort {
  cohort: number | null;
  trainees: TraineeSummary[];
}

export interface TraineeSummary {
  id: string;
  displayName: string;
  thumbnailURL: string | null;
  location?: string;
  hasWorkPermit?: boolean;
  email: string;
  slackID?: string;
  githubHandle?: string;
  linkedIn?: string;
  LearningStatus: string;
  JobPath: string;
  strikes: number;
}
