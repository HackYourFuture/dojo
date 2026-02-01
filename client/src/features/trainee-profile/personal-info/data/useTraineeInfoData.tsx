import {
  Trainee,
  TraineeContactInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  TraineePersonalInfo,
} from '../../../../data/types/Trainee';
import { useMutation, useQuery } from '@tanstack/react-query';

import axios from 'axios';

/**
 * A React Query hook that fetches trainee information data form api.
 *
 * @param {string} traineeId trainee id
 */
export const useTraineeInfoData = (traineeId: string) => {
  return useQuery<Trainee, Error>({
    queryKey: ['traineeInfo', traineeId],
    queryFn: async () => {
      const { data } = await axios.get<Trainee>(`/api/trainees/${traineeId}`);

      return data;
    },
    enabled: !!traineeId,
    //Added because it keeps rendering
    refetchOnMount: false, // Prevent refetching on component mount
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};

//fixme: move to types
export interface SaveTraineeRequestData {
  personalInfo?: Partial<TraineePersonalInfo>;
  contactInfo?: Partial<TraineeContactInfo>;
  educationInfo?: Partial<TraineeEducationInfo>;
  employmentInfo?: Partial<TraineeEmploymentInfo>;
}

//fixme: move to data/trainee/mutations.ts
/**
 * A React Query hook that saves trainee information data to api.
 *
 * @param {string} traineeId trainee id
 */
export const useSaveTraineeInfo = (traineeId: string) => {
  return useMutation({
    mutationFn: async (dataToSave: SaveTraineeRequestData) => {
      const response = await axios.patch(`/api/trainees/${traineeId}`, dataToSave);
      return response.data;
    },
  });
};
