import { LabelCount } from '../models/dashboard';
import { PieChart } from '@mui/x-charts/PieChart';

interface PieRow extends LabelCount {
  // Without one, the slice takes the next color of the chart palette.
  color?: string;
}

interface DistributionPieChartProps {
  rows: PieRow[];
}

export const DistributionPieChart = ({ rows }: DistributionPieChartProps) => {
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <PieChart
      height={280}
      series={[
        {
          data: rows.map((row, index) => ({ id: index, label: row.label, value: row.count, color: row.color })),
          arcLabel: (item) => `${Math.round((item.value / total) * 100)}%`,
          arcLabelMinAngle: 25,
          innerRadius: 50,
          paddingAngle: 1,
          cornerRadius: 3,
        },
      ]}
    />
  );
};
