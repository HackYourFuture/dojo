// Where the volunteer stands with HackYourFuture.
export enum VolunteerStatus {
  Active = 'active',
  Paused = 'paused',
  Stopped = 'stopped',
}

export const volunteerStatusLabels: Record<VolunteerStatus, string> = {
  [VolunteerStatus.Active]: 'Active',
  [VolunteerStatus.Paused]: 'Paused',
  [VolunteerStatus.Stopped]: 'Stopped',
};
