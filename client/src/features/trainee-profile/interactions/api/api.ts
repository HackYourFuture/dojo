import { mapDomainToInteractionRequest, mapInteractionToDomain } from './mapper';

import { Interaction } from '../models/interaction';
import { InteractionResponse } from './types';
import axios from 'axios';

export const getInteractions = async (traineeId: string) => {
  const { data } = await axios.get<InteractionResponse[]>(`/api/trainees/${traineeId}/interactions`);
  return data.map((interaction) => mapInteractionToDomain(interaction));
};

export const addInteraction = async (traineeId: string, interaction: Interaction) => {
  const interactionRequest = mapDomainToInteractionRequest(interaction);
  const { data } = await axios.post<InteractionResponse>(`/api/trainees/${traineeId}/interactions`, interactionRequest);
  return mapInteractionToDomain(data);
};

export const editInteraction = async (traineeId: string, interaction: Interaction) => {
  const interactionRequest = mapDomainToInteractionRequest(interaction);
  const { data } = await axios.put<InteractionResponse>(
    `/api/trainees/${traineeId}/interactions/${interaction.id}`,
    interactionRequest
  );
  return mapInteractionToDomain(data);
};

export const deleteInteraction = async (traineeId: string, interactionId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/interactions/${interactionId}`);
};
