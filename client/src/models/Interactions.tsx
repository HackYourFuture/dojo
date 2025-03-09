import { Reporter } from './Trainee';

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
  TechMentorship = 'tech-mentorship',
  HRMentorship = 'hr-mentorship',
  Other = 'other',
}
