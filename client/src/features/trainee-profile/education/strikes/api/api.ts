import axios from 'axios';
import { Strike } from '../../../../../data/types/Trainee';

export const getStrikes = async (traineeId: string) => {
  const { data } = await axios.get<Strike[]>(`/api/trainees/${traineeId}/strikes`);
  return data;
};

export const addStrike = async (traineeId: string, strike: Strike) => {
  try {
    await axios.post(`/api/trainees/${traineeId}/strikes`, strike);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to add strike');
    }
    throw error;
  }
};

export const deleteStrike = async (traineeId: string, strikeId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/strikes/${strikeId}`);
};

export const editStrike = async (traineeId: string, strike: Strike) => {
  try {
    await axios.put(`/api/trainees/${traineeId}/strikes/${strike.id}`, strike);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to edit strike');
    }
    throw error;
  }
};
