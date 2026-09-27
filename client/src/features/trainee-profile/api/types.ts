import {
  Background,
  EducationLevel,
  EnglishLevel,
  Gender,
  JobPath,
  LearningStatus,
  QuitReason,
  Track,
} from '../../../data/types/Trainee';

export interface TraineeResponse {
  id: string;
  displayName: string;
  profilePath: string;
  pictureUrl: string | null;
  thumbnailUrl: string | null;

  // Personal
  firstName: string;
  lastName: string;
  preferredName: string | null;
  gender: Gender | null;
  pronouns: string | null;
  location: string | null;
  englishLevel: EnglishLevel | null;
  professionalDutch: boolean | null;
  countryOfOrigin: string | null;
  background: Background | null;
  educationLevel: EducationLevel | null;
  educationBackground: string | null;
  comments: string | null;

  // Contact
  email: string;
  slackId: string | null;
  phone: string | null;
  githubHandle: string | null;
  linkedinUrl: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;

  // Education
  startCohort: number;
  currentCohort: number | null;
  track: Track;
  learningStatus: LearningStatus;
  startDate: string | null; // YYYY-MM-DD
  graduationDate: string | null; // YYYY-MM-DD
  quitDate: string | null; // YYYY-MM-DD
  quitReason: QuitReason | null;
  mentorTech: string | null;
  mentorHr: string | null;
  mentorEnglish: string | null;

  // Employment
  jobPath: JobPath;
}

type EditableField = Exclude<
  keyof TraineeResponse,
  'id' | 'displayName' | 'profilePath' | 'pictureUrl' | 'thumbnailUrl'
>;

// A merge patch: every field that is sent is stored, and null clears it.
export type UpdateTraineeRequest = { [Field in EditableField]?: TraineeResponse[Field] | null };

export type CreateTraineeRequest = Pick<
  TraineeResponse,
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'email'
  | 'startCohort'
  | 'currentCohort'
  | 'track'
  | 'learningStatus'
  | 'jobPath'
>;
