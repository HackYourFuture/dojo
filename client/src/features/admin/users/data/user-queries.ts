import { getUsers } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import { userKeys } from './keys';

/** Gets all users, ordered by name by the server. */
export const useGetUsers = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: getUsers,
    enabled,
  });
};
