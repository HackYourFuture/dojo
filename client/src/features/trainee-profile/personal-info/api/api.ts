import axios from 'axios';
import { Trainee } from '../../../../data/types/Trainee';
import { SaveTraineeRequestData } from './types';

export const getTraineeInfo = async (traineeId: string) => {
  const { data } = await axios.get<Trainee>(`/api/trainees/${traineeId}`);
  return data;
};

export const saveTraineeInfo = async (traineeId: string, dataToSave: SaveTraineeRequestData) => {
  const { data } = await axios.patch<Trainee>(`/api/trainees/${traineeId}`, dataToSave);
  return data;
};
