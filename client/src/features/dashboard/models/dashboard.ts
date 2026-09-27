export interface ChartData {
  label: string;
  value: number;
  percent: number;
}

export interface Demographics {
  genderDistribution: ChartData[];
  countryOfOrigin: ChartData[];
}

export interface Program {
  graduations: ChartData[];
  employment: ChartData[];
}

export interface DashboardData {
  demographics: Demographics;
  program: Program;
}
