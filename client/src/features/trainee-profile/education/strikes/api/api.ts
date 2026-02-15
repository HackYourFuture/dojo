import { Strike } from '../models/strike';
import { StrikeRequest } from './types';
import axios from 'axios';

export const getStrikes = async (traineeId: string) => {
  const { data } = await axios.get(`/api/trainees/${traineeId}/strikes`);
  return data;
};

export const deleteStrike = async (traineeId: string, strikeId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/strikes/${strikeId}`);
};

export const addStrike = async (traineeId: string, strike: StrikeRequest) => {
  await axios.post(`/api/trainees/${traineeId}/strikes`, strike);
};

export const editStrike = async (traineeId: string, strike: StrikeRequest) => {
  await axios.put(`/api/trainees/${traineeId}/strikes/${strike.id}`, strike);
};
