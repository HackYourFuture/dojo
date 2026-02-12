import axios from 'axios';
import { EmploymentHistory } from '../../../../data/types/Trainee';

export const getEmployments = async (traineeId: string) => {
  const { data } = await axios.get<EmploymentHistory[]>(`/api/trainees/${traineeId}/employment-history`);
  return data;
};

export const addEmployment = async (traineeId: string, employment: EmploymentHistory) => {
  try {
    await axios.post(`/api/trainees/${traineeId}/employment-history`, employment);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to add employment');
    }

    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};

export const deleteEmployment = async (traineeId: string, employmentId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/employment-history/${employmentId}`);
};

export const editEmployment = async (traineeId: string, employment: EmploymentHistory) => {
  try {
    await axios.put(`/api/trainees/${traineeId}/employment-history/${employment.id}`, employment);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to edit employment');
    }

    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};
