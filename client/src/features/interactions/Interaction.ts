import { ProfileType } from '../../data/types/ProfileType';

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
  Call = 'CALL',
  Chat = 'CHAT',
  Email = 'EMAIL',
  Meeting = 'MEETING',
  Feedback = 'FEEDBACK',
  TechHour = 'TECH_HOUR',
  InPerson = 'IN_PERSON',
  EnglishMentorship = 'ENGLISH_MENTORSHIP',
  TechSupport = 'TECH_SUPPORT',
  GradMentorship = 'GRAD_MENTORSHIP',
  HRMentorship = 'HR_MENTORSHIP',
  Other = 'OTHER',
}

// The types each profile offers when adding or editing an interaction. The server accepts every type on every profile.
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
  volunteer: [
    InteractionType.Call,
    InteractionType.Chat,
    InteractionType.Email,
    InteractionType.Feedback,
    InteractionType.InPerson,
    InteractionType.EnglishMentorship,
    InteractionType.TechSupport,
    InteractionType.GradMentorship,
    InteractionType.HRMentorship,
    InteractionType.Other,
  ],
};
