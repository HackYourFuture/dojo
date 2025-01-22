import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { TraineeInteraction } from '../models';

export const useAddInteraction = (traineeId: string | undefined) => {
  const queryClient = useQueryClient();

  const addInteraction = async (interaction: TraineeInteraction) => {
    const { data } = await axios.post(`/api/trainees/${traineeId}/interactions`, interaction, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  };

  return useMutation(addInteraction, {
    onSuccess: () => {
      queryClient.invalidateQueries(['traineeInfo', traineeId]);
    },
  });
};