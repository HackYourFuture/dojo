import { DashboardResponse } from './types';
import axios from 'axios';
import { mapDashboardToDomain } from './mapper';

export const getDashboard = async (startDate?: string, endDate?: string) => {
  const params = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data } = await axios.get<DashboardResponse>('/api/dashboard', { params });
  return mapDashboardToDomain(data);
};
