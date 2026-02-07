import axios from 'axios';
import { DashboardData } from '../Dashboard';

export const getDashboardData = async (startDate?: string, endDate?: string): Promise<DashboardData> => {
  const response = await axios.get<DashboardData>(`/api/dashboard?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};
