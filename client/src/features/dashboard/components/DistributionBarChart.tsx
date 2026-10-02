import { BarChart } from '@mui/x-charts/BarChart';
import { LabelCount } from '../models/dashboard';
import { useTheme } from '@mui/material';

interface DistributionBarChartProps {
  rows: LabelCount[];
  layout: 'horizontal' | 'vertical';
}

export const DistributionBarChart = ({ rows, layout }: DistributionBarChartProps) => {
  const { palette } = useTheme();
  const labelAxis = { scaleType: 'band' as const, data: rows.map((row) => row.label) };
  const countAxis = { tickMinStep: 1 };
  const series = [{ data: rows.map((row) => row.count), label: 'Trainees', color: palette.primary.main }];

  if (layout === 'horizontal') {
    // Grows with the rows, and makes room for the longest label.
    return (
      <BarChart
        layout="horizontal"
        height={Math.max(200, rows.length * 32 + 50)}
        hideLegend
        xAxis={[countAxis]}
        yAxis={[{ ...labelAxis, width: 'auto' }]}
        series={series}
      />
    );
  }

  // Slants the labels, so long ones fit under narrow bars.
  return (
    <BarChart
      height={300}
      hideLegend
      xAxis={[{ ...labelAxis, height: 'auto', tickLabelStyle: { angle: -35, textAnchor: 'end' } }]}
      yAxis={[countAxis]}
      series={series}
    />
  );
};
