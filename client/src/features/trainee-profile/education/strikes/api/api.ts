import { mapDomainToStrikeRequest, mapStrikeToDomain } from './mapper';

import { Strike } from '../models/strike';
import { StrikeResponse } from './types';
import axios from 'axios';

export const getStrikes = async (traineeId: string) => {
  const { data } = await axios.get<StrikeResponse[]>(`/api/trainees/${traineeId}/strikes`);
  return data.map((strike) => mapStrikeToDomain(strike));
};

// TODO: Move these to mutation file
export const deleteStrike = async (traineeId: string, strikeId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/strikes/${strikeId}`);
};

export const addStrike = async (traineeId: string, strike: Strike) => {
  const strikeRequest = mapDomainToStrikeRequest(strike);
  const { data } = await axios.post<StrikeResponse>(`/api/trainees/${traineeId}/strikes`, strikeRequest);
  return mapStrikeToDomain(data);
};

export const editStrike = async (traineeId: string, strike: Strike) => {
  const strikeRequest = mapDomainToStrikeRequest(strike);

  const { data } = await axios.put<StrikeResponse>(`/api/trainees/${traineeId}/strikes/${strike.id!}`, strikeRequest);
  return mapStrikeToDomain(data);
};
