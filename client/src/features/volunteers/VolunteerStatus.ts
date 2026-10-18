// Where the volunteer stands with HackYourFuture.
export enum VolunteerStatus {
  Active = 'ACTIVE',
  Paused = 'PAUSED',
  Stopped = 'STOPPED',
}

export const volunteerStatusLabels: Record<VolunteerStatus, string> = {
  [VolunteerStatus.Active]: 'Active',
  [VolunteerStatus.Paused]: 'Paused',
  [VolunteerStatus.Stopped]: 'Stopped',
};
