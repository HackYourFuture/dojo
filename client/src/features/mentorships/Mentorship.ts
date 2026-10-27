import { MentorshipType } from './MentorshipType';
import { TraineeReference } from '../../data/types/Trainee';
import { VolunteerReference } from '../volunteers/Volunteer';

// A volunteer mentoring a trainee. The dates are calendar dates at midnight UTC, like the API's.
export interface Mentorship {
  readonly id: string;
  // Built by the client, as the API has no path for a mentorship.
  profilePath: string;
  volunteer: VolunteerReference;
  trainee: TraineeReference;
  type: MentorshipType;
  startDate: Date;
  endDate: Date | null;
  lastCheckinDate: Date | null;
  nextCheckinDate: Date | null;
  // Worked out by the server on every read, or null before the first check-in.
  daysSinceLastCheckin: number | null;
  // The end date is today or earlier, as the server works it out.
  isEnded: boolean;
}

// The mentorship while it is edited. The start date can be cleared, which the server rejects when it is saved.
export type EditedMentorship = Omit<Mentorship, 'startDate'> & { startDate: Date | null };

// The filters of the mentorships list, named as in its URL. An empty id filters nothing.
export interface MentorshipFilters {
  volunteerId: string;
  traineeId: string;
  type: string[];
  status: string[];
}

// What the add dialog sends.
export interface NewMentorship {
  volunteerId: string;
  traineeId: string;
  type: MentorshipType;
  startDate: Date;
  endDate: Date | null;
  nextCheckinDate: Date | null;
}
