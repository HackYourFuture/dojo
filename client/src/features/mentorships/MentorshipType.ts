import { SelectOption } from '../../data/types/SelectOption';

// What a volunteer mentors a trainee in, like the server's MentorshipType.
export enum MentorshipType {
  TechMentorship = 'TECH_MENTORSHIP',
  EnglishMentorship = 'ENGLISH_MENTORSHIP',
  HrMentorship = 'HR_MENTORSHIP',
}

export const mentorshipTypeLabels: Record<MentorshipType, string> = {
  [MentorshipType.TechMentorship]: 'Tech',
  [MentorshipType.EnglishMentorship]: 'English',
  [MentorshipType.HrMentorship]: 'HR',
};

export const mentorshipTypeOptions: SelectOption[] = Object.values(MentorshipType).map((type) => ({
  label: mentorshipTypeLabels[type],
  value: type,
}));
