import axios from 'axios';
import { Cohort } from '../Cohorts';

export const getCohorts = async () => {
  const { data } = await axios.get<Cohort[]>('/api/cohorts');
  return data;
};
