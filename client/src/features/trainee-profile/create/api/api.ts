import { CreateTraineeRequestData } from './types';
import { Trainee } from '../../../../data/types/Trainee';
import axios from 'axios';

export const createTrainee = async (request: CreateTraineeRequestData): Promise<Trainee> => {
  const { data } = await axios.post<Trainee>(`/api/trainees`, request);
  return data;
};
