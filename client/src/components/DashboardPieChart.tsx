import { PieChart } from '@mui/x-charts/PieChart';
import { PieValueType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { Stack, Box, Typography } from '@mui/material';
import { ChartData, DashboardPieChartProps } from '../types';

export const DashboardPieChart = ({ chartData }: DashboardPieChartProps) => {
  const { countryOfOrigin, genderDistribution } = chartData.demographics;
  const { employment, graduations } = chartData.program;

  const piesData = [graduations, employment, genderDistribution, countryOfOrigin];
  const chartTitle = [
    'Graduation percentage',
    'Graduates working in Tech',
    'Gender distribution',
    'Country of origin',
  ];

  const size = {
    width: 400,
    height: 200,
  };

  return (
    <Stack direction="row" useFlexGap flexWrap="wrap">
      {piesData.map((pie: ChartData[], index: number) => (
        <Box key={index} height={250} width={450} my={4} p={2}>
          <Typography variant="h5" p={2}>
            {chartTitle[index]}
          </Typography>
          <PieChart
            series={[
              {
                arcLabel: (item) => `${item.percent}%`,
                arcLabelMinAngle: 45,
                data: pie as MakeOptional<PieValueType, 'id'>[],
              },
            ]}
            {...size}
          />
        </Box>
      ))}
    </Stack>
  );
};
