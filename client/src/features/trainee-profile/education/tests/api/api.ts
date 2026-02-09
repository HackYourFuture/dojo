import axios from 'axios';
import { Test } from '../../../../../data/types/Trainee';

export const getTests = async (traineeId: string) => {
  const { data } = await axios.get<Test[]>(`/api/trainees/${traineeId}/tests`);
  return data;
};

export const addTest = async (traineeId: string, test: Test) => {
  try {
    await axios.post(`/api/trainees/${traineeId}/tests`, test);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to add test');
    }

    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};

export const deleteTest = async (traineeId: string, testId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/tests/${testId}`);
};

export const editTest = async (traineeId: string, test: Test) => {
  try {
    await axios.put(`/api/trainees/${traineeId}/tests/${test.id}`, test);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to edit test');
    }

    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};
