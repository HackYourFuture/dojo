import { NewTrainee, TraineeChanges } from '../../../data/types/Trainee';
import { mapDomainToCreateTraineeRequest, mapDomainToUpdateTraineeRequest, mapTraineeToDomain } from './mapper';

import { TraineeResponse } from './types';
import axios from 'axios';

export const getTrainee = async (traineeId: string) => {
  const { data } = await axios.get<TraineeResponse>(`/api/trainees/${traineeId}`);
  return mapTraineeToDomain(data);
};

export const updateTrainee = async (traineeId: string, changes: TraineeChanges) => {
  const traineeRequest = mapDomainToUpdateTraineeRequest(changes);
  const { data } = await axios.patch<TraineeResponse>(`/api/trainees/${traineeId}`, traineeRequest);
  return mapTraineeToDomain(data);
};

export const createTrainee = async (newTrainee: NewTrainee) => {
  const traineeRequest = mapDomainToCreateTraineeRequest(newTrainee);
  const { data } = await axios.post<TraineeResponse>('/api/trainees', traineeRequest);
  return mapTraineeToDomain(data);
};
