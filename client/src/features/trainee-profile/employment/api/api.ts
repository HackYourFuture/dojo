import { mapDomainToEmploymentHistoryRequest, mapEmploymentHistoryToDomain } from './mapper';

import { EmploymentHistory } from '../models/employment-history';
import { EmploymentHistoryResponse } from './types';
import axios from 'axios';

export const getEmploymentHistory = async (traineeId: string) => {
  const { data } = await axios.get<EmploymentHistoryResponse[]>(`/api/trainees/${traineeId}/employment-history`);
  return data.map((employment) => mapEmploymentHistoryToDomain(employment));
};

export const addEmploymentHistory = async (traineeId: string, employment: EmploymentHistory) => {
  const employmentRequest = mapDomainToEmploymentHistoryRequest(employment);
  const { data } = await axios.post<EmploymentHistoryResponse>(
    `/api/trainees/${traineeId}/employment-history`,
    employmentRequest
  );
  return mapEmploymentHistoryToDomain(data);
};

export const editEmploymentHistory = async (traineeId: string, employment: EmploymentHistory) => {
  const employmentRequest = mapDomainToEmploymentHistoryRequest(employment);
  const { data } = await axios.put<EmploymentHistoryResponse>(
    `/api/trainees/${traineeId}/employment-history/${employment.id}`,
    employmentRequest
  );
  return mapEmploymentHistoryToDomain(data);
};

export const deleteEmploymentHistory = async (traineeId: string, employmentId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/employment-history/${employmentId}`);
};
