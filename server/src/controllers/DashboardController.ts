export interface Distribution {
  label: string;
  value: number;
  percent: number;
}

export interface DashboardData {
  demographics: {
    genderDistribution: Distribution[];
    countryOfOrigin: Distribution[];
  };
  program: {
    graduations: Distribution[];
    employment: Distribution[];
  };
}

export interface DashboardControllerType {
  getDashboard(): Promise<DashboardData>;
}

/**
 * Provides aggregated statistics for the dashboard view.
 */
export class DashboardController implements DashboardControllerType {
  async getDashboard(): Promise<DashboardData> {
    return {
      demographics: {
        genderDistribution: [
          { label: 'Man', value: 214, percent: 57.1 },
          { label: 'Woman', value: 153, percent: 40.8 },
          { label: 'Non binary', value: 7, percent: 1.8 },
          { label: 'Other', value: 1, percent: 0.2 },
        ],
        countryOfOrigin: [
          { label: 'Iraq', value: 50, percent: 12.3 },
          { label: 'Syria', value: 40, percent: 14.3 },
          { label: 'Turkey', value: 35, percent: 17.3 },
          { label: 'Ukraine', value: 22, percent: 18.3 },
          { label: 'Other', value: 12, percent: 19.3 },
        ],
      },
      program: {
        graduations: [
          { label: 'Graduated', value: 120, percent: 80 },
          { label: 'Not graduated', value: 20, percent: 20 },
        ],
        employment: [
          { label: 'In tech', value: 120, percent: 80 },
          { label: 'Not in tech', value: 20, percent: 20 },
        ],
      },
    };
  }
}
