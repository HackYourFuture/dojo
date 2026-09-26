import { EmploymentHistoryRequest, EmploymentHistoryResponse } from './types';

import { EmploymentHistory } from '../models/employment-history';
import { toISODateString } from '../../utils/dateHelper';

export const mapEmploymentHistoryToDomain = (employment: EmploymentHistoryResponse): EmploymentHistory => {
  return {
    id: employment.id,
    type: employment.type,
    companyName: employment.companyName,
    role: employment.role,
    startDate: new Date(employment.startDate),
    endDate: employment.endDate ? new Date(employment.endDate) : null,
    feeCollected: employment.feeCollected,
    feeAmount: employment.feeAmount,
    comments: employment.comments,
  };
};

export const mapDomainToEmploymentHistoryRequest = (employment: EmploymentHistory): EmploymentHistoryRequest => {
  return {
    type: employment.type,
    companyName: employment.companyName,
    role: employment.role,
    startDate: toISODateString(employment.startDate),
    endDate: employment.endDate ? toISODateString(employment.endDate) : null,
    feeCollected: employment.feeCollected,
    feeAmount: employment.feeCollected ? employment.feeAmount : null,
    comments: employment.comments || null,
  };
};
