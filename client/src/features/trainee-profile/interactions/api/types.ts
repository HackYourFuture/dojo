import { InteractionType } from '../models/interaction';

export interface InteractionRequest {
  date: string; // ISO date and time
  type: InteractionType;
  title: string;
  details: string;
}

interface ReporterResponse {
  name: string;
  pictureUrl: string | null;
}

export interface InteractionResponse {
  id: string;
  date: string;
  type: InteractionType;
  title: string;
  details: string;
  reporter: ReporterResponse;
}
