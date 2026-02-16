import axios from 'axios';
import { EmploymentHistory } from '../../../../data/types/Trainee';

export const getEmployments = async (traineeId: string) => {
  const { data } = await axios.get<EmploymentHistory[]>(`/api/trainees/${traineeId}/employment-history`);
  return data;
};

export const addEmployment = async (traineeId: string, employment: EmploymentHistory) => {
  await axios.post(`/api/trainees/${traineeId}/employment-history`, employment);
};

export const deleteEmployment = async (traineeId: string, employmentId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/employment-history/${employmentId}`);
};

export const editEmployment = async (traineeId: string, employment: EmploymentHistory) => {
  await axios.put(`/api/trainees/${traineeId}/employment-history/${employment.id}`, employment);
};
