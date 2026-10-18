// The kind of volunteering a volunteer does
export enum VolunteerType {
  Tech = 'TECH',
  PersonalDevelopment = 'PERSONAL_DEVELOPMENT',
}

export const volunteerTypeLabels: Record<VolunteerType, string> = {
  [VolunteerType.Tech]: 'Tech',
  [VolunteerType.PersonalDevelopment]: 'Personal development',
};
