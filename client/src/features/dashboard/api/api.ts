import { DashboardResponse } from './types';
import axios from 'axios';
import { mapDashboardToDomain } from './mapper';

// A null bound is left out of the query, which leaves that side of the range open.
export const getDashboard = async (startCohort: number | null, endCohort: number | null) => {
  const { data } = await axios.get<DashboardResponse>('/api/dashboard', { params: { startCohort, endCohort } });
  return mapDashboardToDomain(data);
};
