export interface Interaction {
  readonly id: string;
  date: Date;
  type: InteractionType;
  title: string;
  details: string;
  reporter: Reporter;
}

export interface Reporter {
  id: string;
  name: string;
  thumbnailUrl: string | null;
}

export enum InteractionType {
  Call = 'call',
  Chat = 'chat',
  Email = 'email',
  Meeting = 'meeting',
  Feedback = 'feedback',
  TechHour = 'tech-hour',
  InPerson = 'in-person',
  EnglishMentorship = 'english-mentorship',
  TechSupport = 'tech-support',
  GradMentorship = 'grad-mentorship',
  HRMentorship = 'hr-mentorship',
  Other = 'other',
}

// The kinds of profile that have interactions, like the server's ProfileType.
export type ProfileType = 'trainee' | 'organisation';

// The types each profile offers when adding or editing an interaction. The server accepts every type on both.
export const INTERACTION_TYPES: Record<ProfileType, InteractionType[]> = {
  trainee: [
    InteractionType.Call,
    InteractionType.Chat,
    InteractionType.Feedback,
    InteractionType.TechHour,
    InteractionType.InPerson,
    InteractionType.EnglishMentorship,
    InteractionType.TechSupport,
    InteractionType.GradMentorship,
    InteractionType.HRMentorship,
    InteractionType.Other,
  ],
  organisation: [
    InteractionType.Call,
    InteractionType.Chat,
    InteractionType.Email,
    InteractionType.Meeting,
    InteractionType.Feedback,
    InteractionType.InPerson,
    InteractionType.Other,
  ],
};
