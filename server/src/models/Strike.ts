import { DisplayUser } from './User';

export enum StrikeReason {
  LastSubmission = 'late-submission',
  MissedSubmission = 'missed-submission',
  IncompleteSubmission = 'incomplete-submission',
  LateAttendance = 'late-attendance',
  Absence = 'absence',
  PendingFeedback = 'pending-feedback',
  Other = 'other',
}

interface Strike {
  readonly id: string;
  date: Date;
  reason: StrikeReason;
  comments: string;
}

// For presentation in the API response
export type StrikeWithReporter = Strike & { reporter: DisplayUser };

// For database storage
export type StrikeWithReporterID = Strike & { reporterID: string };

export const validateStrike = (strike: StrikeWithReporterID): void => {
  if (!strike.date) {
    throw new Error('Strike date is required');
  }
  if (!strike.reason || !Object.values(StrikeReason).includes(strike.reason)) {
    throw new Error('Unknown strike reason');
  }
  if (!strike.comments) {
    throw new Error('Strike comments are required');
  }
};
