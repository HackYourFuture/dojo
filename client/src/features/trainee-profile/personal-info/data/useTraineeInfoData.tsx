import { getTrainee, updateTrainee } from '../api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Trainee } from '../../../../data/types/Trainee';
import { UpdateTraineeRequestData } from '../api/types';
import { traineeQueryKeys } from './keys';

/**
 * A React Query hook that fetches trainee information data form api.
 *
 * @param {string} traineeId trainee id
 */
export const useTraineeInfoData = (traineeId: string) => {
  return useQuery<Trainee, Error>({
    queryKey: traineeQueryKeys.details(traineeId),
    queryFn: () => getTrainee(traineeId),
    enabled: !!traineeId,
    //Added because it keeps rendering
    refetchOnMount: false, // Prevent refetching on component mount
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};

//fixme: move to data/trainee/mutations.ts
/**
 * A React Query hook that saves trainee information data to api.
 *
 * @param {string} traineeId trainee id
 */
export const useSaveTraineeInfo = (traineeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dataToSave: UpdateTraineeRequestData) => updateTrainee(traineeId, dataToSave),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: traineeQueryKeys.details(traineeId) });
    },
  });
};

export type { UpdateTraineeRequestData };
