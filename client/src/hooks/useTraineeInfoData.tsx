import {
  Trainee,
  TraineeContactInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  TraineePersonalInfo,
} from '../models';
import { useMutation, useQuery } from 'react-query';

import axios from 'axios';

/**
 * A React Query hook that fetches trainee information data form api.
 *
 * @param {string} traineeId trainee id
 */
export const useTraineeInfoData = (traineeId: string) => {
  return useQuery<Trainee, Error>(
    ['traineeInfo', traineeId],
    async () => {
      const { data } = await axios.get<Trainee>(`/api/trainees/${traineeId}`);

      return data;
    },
    {
      enabled: !!traineeId,
      //Added because it keeps rendering
      refetchOnMount: false, // Prevent refetching on component mount
      refetchOnWindowFocus: false, // Prevent refetching on window focus
    }
  );
};

export interface SaveTraineeRequestData {
  personalInfo?: Partial<TraineePersonalInfo>;
  contactInfo?: Partial<TraineeContactInfo>;
  educationInfo?: Partial<TraineeEducationInfo>;
  employmentInfo?: Partial<TraineeEmploymentInfo>;
}

/**
 * A React Query hook that saves trainee information data to api.
 *
 * @param {string} traineeId trainee id
 */
export const useSaveTraineeInfo = (traineeId: string) => {
  return useMutation(async (dataToSave: SaveTraineeRequestData) => {
    const response = await axios.patch(`/api/trainees/${traineeId}`, dataToSave);
    return response.data;
  });
};
