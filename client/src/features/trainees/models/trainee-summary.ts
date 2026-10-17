import { JobPath, LearningStatus, Track } from '../../../data/types/Trainee';

import { City } from '../../geo/models/city';

// The filters of the trainees list, named as in its URL and the API.
export interface TraineeFilters {
  q: string;
  status: string[];
  jobPath: string[];
  province: string[];
  startCohort: number | null;
  endCohort: number | null;
}

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
