import { PieArcLabel, PieArcLabelProps, PieChart } from '@mui/x-charts/PieChart';
import { LabelCount } from '../models/dashboard';
import { useTheme } from '@mui/material';

interface PieRow extends LabelCount {
  // Without one, the slice takes the next color of the chart palette.
  color?: string;
}

// Black or white text, whichever reads better on the slice.
const ContrastArcLabel = (props: PieArcLabelProps) => {
  const { palette } = useTheme();
  return <PieArcLabel {...props} style={{ fill: palette.getContrastText(props.color) }} />;
};

interface DistributionPieChartProps {
  rows: PieRow[];
}

export const DistributionPieChart = ({ rows }: DistributionPieChartProps) => {
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <PieChart
      height={280}
      slots={{ pieArcLabel: ContrastArcLabel }}
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
