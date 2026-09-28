import { InteractionRequest, InteractionResponse } from './types';

import { Interaction } from '../models/interaction';

export const mapInteractionToDomain = (interaction: InteractionResponse): Interaction => {
  return {
    id: interaction.id,
    date: new Date(interaction.date),
    type: interaction.type,
    title: interaction.title,
    details: interaction.details,
    reporter: {
      id: interaction.reporter.id,
      name: interaction.reporter.name,
      thumbnailUrl: interaction.reporter.thumbnailUrl,
    },
  };
};

export const mapDomainToInteractionRequest = (interaction: Interaction): InteractionRequest => {
  return {
    date: interaction.date.toISOString(),
    type: interaction.type,
    title: interaction.title,
    details: interaction.details,
  };
};
