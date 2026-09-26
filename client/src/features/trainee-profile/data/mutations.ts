import { NewTrainee, TraineeChanges } from '../../../data/types/Trainee';
import { createTrainee, updateTrainee } from '../api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { traineeKeys } from './keys';

/**
 * Hook to save the edited fields of a trainee profile.
 * @param {string} traineeId trainee id
 */
export const useUpdateTrainee = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (changes: TraineeChanges) => updateTrainee(traineeId, changes),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: traineeKeys.details(traineeId) }),
  });
};

/**
 * Hook to create a new trainee profile.
 */
export const useCreateTrainee = () => {
  return useMutation({
    mutationFn: (newTrainee: NewTrainee) => createTrainee(newTrainee),
  });
};
