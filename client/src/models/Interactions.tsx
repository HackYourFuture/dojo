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
  CALL = 'call',
  CHAT = 'chat',
  FEEDBACK = 'feedback',
  IN_PERSON = 'in-person',
  TECH_HOUR = 'tech-hour',
  OTHER = 'other',
}
