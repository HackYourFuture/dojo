export enum StrikeReason {
  LastSubmission = "late-submission",
  MissedSubmission = "missed-submission",
  IncompleteSubmission = "incomplete-submission",
  LateAttendance = "late-attendance",
  Absence = "absence",
  PendingFeedback = "pending-feedback",
  Other = "other",
}

export interface StrikeReporter {
  readonly name: string;
  readonly imageUrl?: string;
}

interface Strike {
  readonly id: string;
  date: Date;
  reason: StrikeReason;
  comments: string;
}

// For presentation in the API response
export interface StrikeWithReporter extends Strike {
  reporter: StrikeReporter;
}

// For database storage
export interface StrikeWithReporterID extends Strike {
  reporterID: string
}
