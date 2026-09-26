import { AssessmentResult, AssessmentType } from '../models/assessment';

export interface AssessmentRequest {
  date: string; // YYYY-MM-DD
  type: AssessmentType;
  result: AssessmentResult;
  score: number | null;
  comments: string | null;
}

export interface AssessmentResponse {
  id: string;
  date: string;
  type: AssessmentType;
  result: AssessmentResult;
  score: number | null;
  comments: string | null;
}
