import { DashboardData } from '../models/dashboard';
import { DashboardResponse } from './types';

export const mapDashboardToDomain = (dashboard: DashboardResponse): DashboardData => {
  return {
    demographics: {
      genderDistribution: dashboard.demographics.genderDistribution,
      countryOfOrigin: dashboard.demographics.countryOfOrigin,
    },
    program: {
      graduations: dashboard.program.graduations,
      employment: dashboard.program.employment,
    },
  };
};
