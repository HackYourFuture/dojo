import { Box, Stack, Typography } from '@mui/material';
import { ChartData, DashboardData } from '../Dashboard';

import { PieChart } from '@mui/x-charts/PieChart';
import { PieValueType } from '@mui/x-charts';

export interface DashboardPieChartProps {
  chartData: DashboardData;
}
/**
 * Component for showing pie charts in the Dashboard page.
 *
 * @param {DashboardData} chartData The data to display in the pie charts.
 * @returns {ReactNode} A React element that renders a stack of pie chart with chartData.
 */
export const DashboardPieChart = ({ chartData }: DashboardPieChartProps) => {
  const { countryOfOrigin, genderDistribution } = chartData.demographics;
  const { employment, graduations } = chartData.program;

  const piesData = [graduations, employment, genderDistribution, countryOfOrigin];
  const chartTitle = ['Graduation percentage', 'Graduates working in Tech', 'Gender distribution', 'Country of origin'];

  const size = {
    width: 400,
    height: 200,
  };

  return (
    <Stack direction="row" useFlexGap flexWrap="wrap">
      {piesData.map((pie: ChartData[], index: number) => {
        // Map ChartData to PieValueType with all required fields
        const formattedData: PieValueType[] = pie.map((item) => ({
          id: item.label,
          label: item.label,
          value: item.value,
        }));
        return (
          <Box key={index} height={250} width={450} my={4} p={2}>
            <Typography variant="h5" p={2}>
              {chartTitle[index]}
            </Typography>
            <PieChart
              series={[
                {
                  arcLabel: (item) => {
                    const chartItem = pie.find((data) => data.label === item.label);
                    return chartItem ? `${chartItem.percent}%` : '';
                  },
                  arcLabelMinAngle: 45,
                  data: formattedData,
                },
              ]}
              {...size}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
