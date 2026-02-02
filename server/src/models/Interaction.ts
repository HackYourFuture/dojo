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

export const validateInteraction = (interaction: InteractionWithReporterID): void => {
  if (!interaction.date) {
    throw new Error('Interaction date is required');
  }
  if (!interaction.reporterID) {
    throw new Error('Interaction reporter ID is required');
  }
  if (!interaction.details) {
    throw new Error('Interaction details are required');
  }
  if (!Object.values(InteractionType).includes(interaction.type)) {
    throw new Error(
      `Unknown interaction type: ${interaction.type}. Allowed types: ${Object.values(InteractionType).join(', ')}`
    );
  }
};
