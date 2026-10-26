import { MentorshipType } from './MentorshipType';
import { TraineeReference } from '../../data/types/Trainee';
import { VolunteerReference } from '../volunteers/Volunteer';
import { formatDateForDisplay } from '../../data/dates';

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

// Like "01-09-2026 to 01-12-2026", or "From 01-09-2026" while the mentorship has no end date.
export const formatPeriod = (startDate: Date, endDate: Date | null) =>
  endDate
    ? `${formatDateForDisplay(startDate)} to ${formatDateForDisplay(endDate)}`
    : `From ${formatDateForDisplay(startDate)}`;

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
