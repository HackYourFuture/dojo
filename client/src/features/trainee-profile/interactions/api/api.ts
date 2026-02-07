import axios from 'axios';
import { Interaction } from '../Interactions';

export const getInteractions = async (traineeId: string) => {
  try {
    const { data } = await axios.get(`/api/trainees/${traineeId}/interactions`);
    return data as Interaction[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to get interactions');
    }
    throw new Error('Failed to get interactions');
  }
};

export const addInteraction = async (traineeId: string, interaction: Partial<Interaction>) => {
  try {
    await axios.post(`/api/trainees/${traineeId}/interactions`, interaction);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to add interaction');
    }

    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};

export const deleteInteraction = async (traineeId: string, interactionId: string) => {
  try {
    await axios.delete(`/api/trainees/${traineeId}/interactions/${interactionId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to delete interaction');
    }

    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};

export const editInteraction = async (traineeId: string, interaction: Interaction) => {
  try {
    await axios.put(`/api/trainees/${traineeId}/interactions/${interaction.id}`, interaction);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to edit interaction');
    }

    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};
