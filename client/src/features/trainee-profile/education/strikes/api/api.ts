import { StrikeRequest, StrikeResponse } from './types';

import axios from 'axios';
import { mapStrikeToDomain } from './mapper';

export const getStrikes = async (traineeId: string) => {
  const { data } = await axios.get<StrikeResponse[]>(`/api/trainees/${traineeId}/strikes`);
  return data.map((strike) => mapStrikeToDomain(strike));
};

// TODO: Move these to mutation file
export const deleteStrike = async (traineeId: string, strikeId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/strikes/${strikeId}`);
};

export const addStrike = async (traineeId: string, strike: StrikeRequest) => {
  await axios.post(`/api/trainees/${traineeId}/strikes`, strike);
};

export const editStrike = async (traineeId: string, strike: StrikeRequest) => {
  await axios.put(`/api/trainees/${traineeId}/strikes/${strike.id!}`, strike);
};
