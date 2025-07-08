export enum EmploymentType {
  Internship = 'internship',
  Job = 'job',
}

export interface EmploymentHistory {
  readonly id: string;
  type: EmploymentType;
  companyName: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  feeCollected: boolean;
  feeAmount?: number;
  comments?: string;
}

export const validateEmploymentHistory = (history: EmploymentHistory): void => {
  if (!history.role) {
    throw new Error('Role is required');
  }
  if (!history.companyName) {
    throw new Error('Company name is required');
  }
  if (typeof history.feeCollected !== 'boolean') {
    throw new Error('feeCollected is required');
  }
  if (!history.startDate) {
    throw new Error('Start date is required');
  }
  if (!history.type) {
    throw new Error('type is required');
  }
  if (!Object.values(EmploymentType).includes(history.type)) {
    throw new Error('Unknown employment type value');
  }
};
