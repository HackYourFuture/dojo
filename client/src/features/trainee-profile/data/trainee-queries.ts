import { PROFILE_QUERY_OPTIONS } from '../../../data/tanstack/tanstackClient';
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
    ...PROFILE_QUERY_OPTIONS,
  });
};
