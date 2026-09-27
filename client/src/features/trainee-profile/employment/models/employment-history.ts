export interface EmploymentHistory {
  readonly id: string;
  type: EmploymentType;
  companyName: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  feeCollected: boolean;
  feeAmount: number | null;
  comments: string | null;
}

export enum EmploymentType {
  Internship = 'internship',
  Job = 'job',
}
