import { MentorshipType } from '../MentorshipType';

// The volunteer or the trainee, as the API embeds them in a mentorship.
interface PersonReferenceResponse {
  id: string;
  name: string;
  profilePath: string;
  thumbnailUrl: string | null;
}

export interface MentorshipResponse {
  id: string;
  volunteer: PersonReferenceResponse;
  trainee: PersonReferenceResponse;
  type: MentorshipType;
  startDate: string; // YYYY-MM-DD
  lastCheckinDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  isEnded: boolean;
  nextCheckinDate: string | null; // YYYY-MM-DD
  daysSinceLastCheckin: number | null;
}

export interface MentorshipRequest {
  volunteerId: string;
  traineeId: string;
  type: MentorshipType;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  nextCheckinDate: string | null; // YYYY-MM-DD
}
