// TODO: key factory

import { getCurrentSession } from '../../data/api';
import { useQuery } from '@tanstack/react-query';

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await getCurrentSession();
      //FIXME: delete the log
      console.log(response);
      return response;
    },
    refetchOnWindowFocus: false,
  });
};
