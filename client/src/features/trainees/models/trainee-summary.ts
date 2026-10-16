import { JobPath, LearningStatus, Track } from '../../../data/types/Trainee';

import { City } from '../../geo/models/city';

export interface Cohort {
  cohort: number | null;
  trainees: TraineeSummary[];
}

export interface TraineeSummary {
  readonly id: string;
  displayName: string;
  profilePath: string;
  thumbnailUrl: string | null;
  city: City | null;
  email: string;
  slackId: string | null;
  githubHandle: string | null;
  linkedinUrl: string | null;
  learningStatus: LearningStatus;
  track: Track;
  jobPath: JobPath;
  averageAssessmentScore: number | null;
  cohort: number | null;
}
