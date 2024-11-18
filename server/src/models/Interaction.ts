import { DisplayUser } from './User';

export enum InteractionType {
  Call = 'call',
  Chat = 'chat',
  Feedback = 'feedback',
  TechHour = 'tech-hour',
  InPerson = 'in-person',
  Other = 'other',
}

export interface Interaction {
  readonly id: string;
  date: Date;
  type: InteractionType;
  reporterID: string;
  title: string;
  details: string;
}

// For presentation in the API response
export type InteractionWithReporter = Interaction & { reporter: DisplayUser };

// For database storage
export type InteractionWithReporterID = Interaction & { reporterID: string };
