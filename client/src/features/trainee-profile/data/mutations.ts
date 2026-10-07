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
    // The response is the saved trainee, so the profile shows it without loading it again.
    onSuccess: (trainee) => queryClient.setQueryData(traineeKeys.details(traineeId), trainee),
  });
};

/**
 * Hook to create a new trainee profile.
 */
export const useCreateTrainee = () => {
  return useMutation({
    mutationFn: (newTrainee: NewTrainee) => createTrainee(newTrainee),
    // A failed request may still have created it, and a retry would then fail on the taken email.
    retry: false,
  });
};
