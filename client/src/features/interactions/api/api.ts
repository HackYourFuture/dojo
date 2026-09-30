import { PROFILE_PATHS, ProfileType } from '../../../data/types/ProfileType';
import { mapDomainToInteractionRequest, mapInteractionToDomain } from './mapper';

import { Interaction } from '../Interaction';
import { InteractionResponse } from './types';
import axios from 'axios';

const interactionsUrl = (profileType: ProfileType, profileId: string) => {
  return `/api/${PROFILE_PATHS[profileType]}/${profileId}/interactions`;
};

export const getInteractions = async (profileType: ProfileType, profileId: string) => {
  const { data } = await axios.get<InteractionResponse[]>(interactionsUrl(profileType, profileId));
  return data.map((interaction) => mapInteractionToDomain(interaction));
};

export const addInteraction = async (profileType: ProfileType, profileId: string, interaction: Interaction) => {
  const interactionRequest = mapDomainToInteractionRequest(interaction);
  const { data } = await axios.post<InteractionResponse>(interactionsUrl(profileType, profileId), interactionRequest);
  return mapInteractionToDomain(data);
};

export const editInteraction = async (profileType: ProfileType, profileId: string, interaction: Interaction) => {
  const interactionRequest = mapDomainToInteractionRequest(interaction);
  const { data } = await axios.put<InteractionResponse>(
    `${interactionsUrl(profileType, profileId)}/${interaction.id}`,
    interactionRequest
  );
  return mapInteractionToDomain(data);
};

export const deleteInteraction = async (profileType: ProfileType, profileId: string, interactionId: string) => {
  await axios.delete(`${interactionsUrl(profileType, profileId)}/${interactionId}`);
};
