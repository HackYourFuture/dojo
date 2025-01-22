import { Trainee } from '../models';
import axios from 'axios';
import { useQuery } from 'react-query';

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
      console.log('useTraineeInfoData', data);

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
