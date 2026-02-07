import axios from 'axios';
import { DashboardData } from '../Dashboard';

export const getDashboardData = async (startDate?: string, endDate?: string): Promise<DashboardData> => {
  const params = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const response = await axios.get<DashboardData>('/api/dashboard', { params });

  return response.data;
};
