import { MentorshipCheckinParticipant } from '../MentorshipCheckinParticipant';

export interface MentorshipCheckinResponse {
  id: string;
  date: string; // YYYY-MM-DD
  participant: MentorshipCheckinParticipant;
  notes: string;
}

// Adding and editing both send every field.
export type MentorshipCheckinRequest = Omit<MentorshipCheckinResponse, 'id'>;
