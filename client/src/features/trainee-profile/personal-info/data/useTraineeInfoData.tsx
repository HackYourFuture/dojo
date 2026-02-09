import { Trainee } from '../../../../data/types/Trainee';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getTraineeInfo, saveTraineeInfo } from '../api/api';
import { SaveTraineeRequestData } from '../api/types';

/**
 * A React Query hook that fetches trainee information data form api.
 *
 * @param {string} traineeId trainee id
 */
export const useTraineeInfoData = (traineeId: string) => {
  return useQuery<Trainee, Error>({
    queryKey: ['traineeInfo', traineeId],
    queryFn: () => getTraineeInfo(traineeId),
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
  return useMutation({
    mutationFn: (dataToSave: SaveTraineeRequestData) => saveTraineeInfo(traineeId, dataToSave),
  });
};

export type { SaveTraineeRequestData };
