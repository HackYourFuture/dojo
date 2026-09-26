interface ChartDataResponse {
  label: string;
  value: number;
  percent: number;
}

export interface DashboardResponse {
  demographics: {
    genderDistribution: ChartDataResponse[];
    countryOfOrigin: ChartDataResponse[];
  };
  program: {
    graduations: ChartDataResponse[];
    employment: ChartDataResponse[];
  };
}
