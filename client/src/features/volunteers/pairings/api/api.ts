import { mapDomainToMentorPairingRequest, mapMentorPairingToDomain } from './mapper';

import { MentorPairing } from '../MentorPairing';
import { MentorPairingResponse } from './types';
import axios from 'axios';

const pairingsUrl = (volunteerId: string) => `/api/volunteers/${volunteerId}/pairings`;

// The latest start date first.
export const getMentorPairings = async (volunteerId: string) => {
  const { data } = await axios.get<MentorPairingResponse[]>(pairingsUrl(volunteerId));
  return data.map((pairing) => mapMentorPairingToDomain(pairing));
};

export const addMentorPairing = async (volunteerId: string, pairing: MentorPairing) => {
  const pairingRequest = mapDomainToMentorPairingRequest(pairing);
  const { data } = await axios.post<MentorPairingResponse>(pairingsUrl(volunteerId), pairingRequest);
  return mapMentorPairingToDomain(data);
};

export const editMentorPairing = async (volunteerId: string, pairing: MentorPairing) => {
  const pairingRequest = mapDomainToMentorPairingRequest(pairing);
  const { data } = await axios.put<MentorPairingResponse>(`${pairingsUrl(volunteerId)}/${pairing.id}`, pairingRequest);
  return mapMentorPairingToDomain(data);
};

export const deleteMentorPairing = async (volunteerId: string, pairingId: string) => {
  await axios.delete(`${pairingsUrl(volunteerId)}/${pairingId}`);
};
