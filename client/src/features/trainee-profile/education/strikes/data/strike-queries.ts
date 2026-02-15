import { Strike } from '../models/strike';
import { getStrikes } from '../api/api';
import { mapStrikeToDomain } from '../api/mapper';
import { strikeKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to get the strikes of a trainee.
 * @param {string} traineeId the id of the trainee to get the strikes from.
 * @returns {UseQueryResult<Strike[], Error>} the strikes of the trainee.
 */
export const useGetStrikes = (traineeId: string) => {
  return useQuery({
    queryKey: strikeKeys.list(traineeId),
    queryFn: async () => {
      const data = await getStrikes(traineeId);

      const strikes = data.map((strike) => mapStrikeToDomain(strike));
      return orderStrikesByDateDesc(strikes);
    },
    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

const orderStrikesByDateDesc = (data: Strike[]): Strike[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
