import { useQuery } from 'react-query';
import axios from 'axios';
import { Cohort } from '../models';

/**
 * A React Query hook that fetches cohort data form api for specific dates.
 */
export const useCohortsData = () => {
  return useQuery(
    ['CohortsInfo'],
    () => {
      return axios.get<Cohort[]>(`/api/cohorts`);
    },
    {
      select: ({ data }) => {
        return data;
      },
    }
  );
};
