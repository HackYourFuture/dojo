

  export interface Reporter {
    name: string;
    imageUrl: string;
  }

  
  export enum InteractionType1 {
    Call = 'call',
    Chat = 'chat',
    Feedback = 'feedback',
    TechHour = 'tech-hour',
    InPerson = 'in-person',
    Other = 'other',
    Empty = ''
  }

  export interface TraineeInteraction {
    readonly id: string;
    date: Date;
    type: InteractionType1[];
    title: string;
    reporter: Reporter[];
    details: string;
  }