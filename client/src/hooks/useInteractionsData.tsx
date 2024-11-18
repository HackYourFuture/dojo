import { useQuery } from 'react-query';
import axios from 'axios';
import { TraineeInteraction } from '../models';


export const useInteractionsData = (traineeId: string | undefined) => {
  return useQuery(
    ['traineeInfo', traineeId],
    async () => {
      const { data } = await axios.get<TraineeInteraction>(`/api/trainees/${traineeId}/interactions`);
      return data;
    },
    {
      enabled: !!traineeId,
    }
  );
};
