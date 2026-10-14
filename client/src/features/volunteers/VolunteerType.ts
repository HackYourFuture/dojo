// The kind of volunteering a volunteer does
export enum VolunteerType {
  Tech = 'tech',
  PersonalDevelopment = 'personal-development',
}

export const volunteerTypeLabels: Record<VolunteerType, string> = {
  [VolunteerType.Tech]: 'Tech',
  [VolunteerType.PersonalDevelopment]: 'Personal development',
};
