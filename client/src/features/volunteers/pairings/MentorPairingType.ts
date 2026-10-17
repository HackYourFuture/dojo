// What a volunteer mentors a trainee in, like the server's MentorPairingType.
export enum MentorPairingType {
  TechMentorship = 'TECH_MENTORSHIP',
  EnglishMentorship = 'ENGLISH_MENTORSHIP',
  HrMentorship = 'HR_MENTORSHIP',
}

export const mentorPairingTypeLabels: Record<MentorPairingType, string> = {
  [MentorPairingType.TechMentorship]: 'Tech mentorship',
  [MentorPairingType.EnglishMentorship]: 'English mentorship',
  [MentorPairingType.HrMentorship]: 'HR mentorship',
};
