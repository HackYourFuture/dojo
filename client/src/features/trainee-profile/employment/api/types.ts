import { EmploymentType } from '../models/employment-history';

export interface EmploymentHistoryRequest {
  type: EmploymentType;
  companyName: string;
  role: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  feeCollected: boolean;
  feeAmount: number | null;
  comments: string | null;
}

export interface EmploymentHistoryResponse {
  id: string;
  type: EmploymentType;
  companyName: string;
  role: string;
  startDate: string;
  endDate: string | null;
  feeCollected: boolean;
  feeAmount: number | null;
  comments: string | null;
}
