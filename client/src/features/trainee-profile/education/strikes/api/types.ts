import { StrikeReason } from '../models/strike';

export interface StrikeRequest {
  reason: StrikeReason;
  date: string; // ISO String for backend
  comments: string;
  reporterID?: string; // Optional because the backend can default to the session user
}

interface ReporterDTO {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface StrikeResponse {
  id: string;
  comments: string;
  date: string;
  reason: StrikeReason;
  reporter: ReporterDTO;
}
