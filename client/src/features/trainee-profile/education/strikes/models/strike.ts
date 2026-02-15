export type Strike = {
  readonly id: string;
  date: Date;
  reason: StrikeReason;
  comments: string;
  reporterName?: string;
  reporterImageUrl?: string;
};

export enum StrikeReason {
  LateSubmission = 'late-submission',
  MissedSubmission = 'missed-submission',
  IncompleteSubmission = 'incomplete-submission',
  LateAttendance = 'late-attendance',
  Absence = 'absence',
  PendingFeedback = 'pending-feedback',
  Other = 'other',
}
