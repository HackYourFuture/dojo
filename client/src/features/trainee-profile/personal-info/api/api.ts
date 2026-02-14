import { Trainee } from '../../../../data/types/Trainee';
import { UpdateTraineeRequestData } from './types';
import axios from 'axios';

export const getTrainee = async (traineeId: string) => {
  const { data } = await axios.get<Trainee>(`/api/trainees/${traineeId}`);
  return data;
};

export const updateTrainee = async (traineeId: string, dataToSave: UpdateTraineeRequestData) => {
  const { data } = await axios.patch<Trainee>(`/api/trainees/${traineeId}`, dataToSave);
  return data;
};
