import { getTrainee } from '../api/api';
import { traineeKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to get the profile of a trainee.
 * @param {string} traineeId trainee id
 */
export const useGetTrainee = (traineeId: string) => {
  return useQuery({
    queryKey: traineeKeys.details(traineeId),
    queryFn: () => getTrainee(traineeId),
    enabled: !!traineeId,
    //Added because it keeps rendering
    refetchOnMount: false, // Prevent refetching on component mount
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};
