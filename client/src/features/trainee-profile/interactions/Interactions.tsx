import { Reporter } from '../../../data/types/Trainee';

export interface Interaction {
  id: string;
  date: Date;
  type: InteractionType;
  title: string;
  details: string;
  reporter: Reporter;
}
export enum InteractionType {
  Call = 'call',
  Chat = 'chat',
  Feedback = 'feedback',
  TechHour = 'tech-hour',
  InPerson = 'in-person',
  EnglishMentorship = 'english-mentorship',
  TechSupport = 'tech-support',
  GradMentorship = 'grad-mentorship',
  HRMentorship = 'hr-mentorship',
  Other = 'other',
}
