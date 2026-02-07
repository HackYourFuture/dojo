import axios from 'axios';
import { Trainee } from '../../../../data/types/Trainee';
import { SaveTraineeRequestData } from './types';

export const getTraineeInfo = async (traineeId: string): Promise<Trainee> => {
  const { data } = await axios.get<Trainee>(`/api/trainees/${traineeId}`);
  return data;
};

export const saveTraineeInfo = async (traineeId: string, dataToSave: SaveTraineeRequestData): Promise<Trainee> => {
  const response = await axios.patch(`/api/trainees/${traineeId}`, dataToSave);
  return response.data;
};
