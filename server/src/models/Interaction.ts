import z from 'zod';
import { DisplayUser } from './User';

export enum InteractionType {
  Call = 'call',
  Chat = 'chat',
  Feedback = 'feedback',
  TechHour = 'tech-hour',
  InPerson = 'in-person',
  TechSupport = 'tech-support',
  EnglishMentorship = 'english-mentorship',
  GradMentorship = 'grad-mentorship',
  HRMentorship = 'hr-mentorship',
  Other = 'other',
}

export interface Interaction {
  readonly id?: string;
  date: Date;
  type: InteractionType;
  reporterID: string;
  title: string;
  details: string;
}

// For presentation in the API response
export type InteractionWithReporter = Interaction & { reporter: DisplayUser };

// For database storage
// ! reporterID is already part of the interface Interaction?
export type InteractionWithReporterID = Interaction & { reporterID: string };

export const InteractionTypeSchema = z.enum(InteractionType);

export const InteractionSchema = z.object({
  id: z.string(),
  date: z.date(),
  type: InteractionTypeSchema,
  reporterID: z.string(),
  title: z.string(),
  details: z.string(),
});

export const InteractionInputSchema = InteractionSchema.partial({
  id: true,
});
