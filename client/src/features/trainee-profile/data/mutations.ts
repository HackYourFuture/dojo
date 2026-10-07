import { NewTrainee, TraineeChanges } from '../../../data/types/Trainee';
import { createTrainee, deleteTrainee, updateTrainee } from '../api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { searchKeys } from '../../search/data/keys';
import { traineeKeys } from './keys';
import { traineeListKeys } from '../../trainees/data/keys';

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

/**
 * Hook to delete a trainee with their interactions, assessments, employment history and picture.
 * @param {string} traineeId trainee id
 */
export const useDeleteTrainee = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTrainee(traineeId),
    // A retry after a lost response would fail on the trainee that is already deleted.
    retry: false,
    // Nothing is returned, so the page does not wait for a list to reload before it leaves the profile.
    onSuccess: () => {
      // Removed instead of reset, so the profile that is still on screen does not load the deleted trainee again.
      queryClient.removeQueries({ queryKey: traineeKeys.details(traineeId) });
      // Reset, so a list or search on screen reloads, like after going back while the delete ran.
      queryClient.resetQueries({ queryKey: traineeListKeys.list() });
      queryClient.resetQueries({ queryKey: searchKeys.all() });
    },
  });
};
