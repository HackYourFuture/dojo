// What a volunteer mentors a trainee in, like the server's MentorPairingType.
export enum MentorPairingType {
  TechMentorship = 'tech-mentorship',
  EnglishMentorship = 'english-mentorship',
  HrMentorship = 'hr-mentorship',
}

export const mentorPairingTypeLabels: Record<MentorPairingType, string> = {
  [MentorPairingType.TechMentorship]: 'Tech mentorship',
  [MentorPairingType.EnglishMentorship]: 'English mentorship',
  [MentorPairingType.HrMentorship]: 'HR mentorship',
};
