export interface MentorshipCheckinResponse {
  id: string;
  date: string; // YYYY-MM-DD
  notes: string;
}

// Adding and editing both send every field.
export type MentorshipCheckinRequest = Omit<MentorshipCheckinResponse, 'id'>;
