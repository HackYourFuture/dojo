import { JobPath, LearningStatus, Track } from '../../../data/types/Trainee';

import { CityResponse } from '../../geo/api/types';

export interface TraineeSummaryResponse {
  id: string;
  displayName: string;
  profilePath: string;
  thumbnailUrl: string | null;
  city: CityResponse | null;
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
