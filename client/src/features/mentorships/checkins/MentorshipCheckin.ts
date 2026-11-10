import { MentorshipCheckinParticipant } from './MentorshipCheckinParticipant';

// A check-in with the mentor or the trainee. The date is a calendar date at midnight UTC, like the API's.
export interface MentorshipCheckin {
  readonly id: string;
  date: Date;
  participant: MentorshipCheckinParticipant;
  notes: string;
}

// What the add dialog sends: the check-in, and the mentorship's next check-in date, which it may have changed.
export interface NewMentorshipCheckin {
  checkin: MentorshipCheckin;
  nextCheckinDate: Date | null;
}
