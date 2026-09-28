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
  Feedback = 'feedback',
  TechHour = 'tech-hour',
  InPerson = 'in-person',
  EnglishMentorship = 'english-mentorship',
  TechSupport = 'tech-support',
  GradMentorship = 'grad-mentorship',
  HRMentorship = 'hr-mentorship',
  Other = 'other',
}
