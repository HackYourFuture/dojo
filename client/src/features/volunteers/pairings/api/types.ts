import { MentorPairingType } from '../MentorPairingType';

interface TraineeReferenceResponse {
  id: string;
  name: string;
  profilePath: string;
  thumbnailUrl: string | null;
}

export interface MentorPairingResponse {
  id: string;
  trainee: TraineeReferenceResponse;
  type: MentorPairingType;
  startDate: string; // YYYY-MM-DD
  lastCheckinDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  nextCheckinDate: string | null; // YYYY-MM-DD
  daysSinceLastCheckin: number | null;
}

// Adding and editing both send every field.
export interface MentorPairingRequest {
  traineeId: string;
  type: MentorPairingType;
  startDate: string; // YYYY-MM-DD
  lastCheckinDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  nextCheckinDate: string | null; // YYYY-MM-DD
}
