// Whether a mentorship still runs. The API has no status field, only isEnded and the end date filters.
export enum MentorshipStatus {
  Active = 'ACTIVE',
  Ended = 'ENDED',
}

export const mentorshipStatusLabels: Record<MentorshipStatus, string> = {
  [MentorshipStatus.Active]: 'Active',
  [MentorshipStatus.Ended]: 'Ended',
};
