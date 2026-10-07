import { EducationLevel, LearningStatus, Track } from '../../../data/types/Trainee';

import { Gender } from '../../../data/types/Person';

export interface DashboardResponse {
  overview: {
    studying: number;
    onHold: number;
    searching: number;
    active: number;
    workingInIt: number;
    leftWithoutItJob: number;
    total: number;
  };
  learningStatuses: { status: LearningStatus; count: number }[];
  tracks: { track: Track; count: number }[];
  educationLevels: { educationLevel: EducationLevel | null; count: number }[];
  countries: { country: string | null; count: number }[];
  genders: { gender: Gender | null; count: number }[];
}
