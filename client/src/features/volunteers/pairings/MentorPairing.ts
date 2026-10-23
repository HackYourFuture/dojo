import { MentorPairingType } from './MentorPairingType';
import { TraineeReference } from '../../../data/types/Trainee';
import { daysFromToday } from '../../../data/dates';

// A volunteer mentoring a trainee. The dates are calendar dates at midnight UTC, like the API's.
export interface MentorPairing {
  readonly id: string;
  trainee: TraineeReference;
  type: MentorPairingType;
  startDate: Date;
  lastCheckinDate: Date | null;
  endDate: Date | null;
  nextCheckinDate: Date | null;
  // Worked out by the server on every read, or null before the first check-in.
  daysSinceLastCheckin: number | null;
}

// Until its end date has passed, so a pairing that ends today is still ongoing.
export const isOngoing = (pairing: MentorPairing) => {
  return pairing.endDate === null || daysFromToday(pairing.endDate) >= 0;
};
