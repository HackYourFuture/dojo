import { LabelCount, NOT_SPECIFIED } from '../models/dashboard';
import { PieArcLabel, PieArcLabelProps, PieChart } from '@mui/x-charts/PieChart';

import { useState } from 'react';
import { useTheme } from '@mui/material';

const SERIES_ID = 'trainees';

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

/** A pie chart where a click on a legend item hides or shows its slice. Not specified starts hidden. */
export const DistributionPieChart = ({ rows }: DistributionPieChartProps) => {
  // By label, as the chart counts by position and the rows change with the cohorts.
  const [hiddenLabels, setHiddenLabels] = useState([NOT_SPECIFIED]);
  // Of the shown slices, so their percentages add up to 100.
  const total = rows.reduce((sum, row) => (hiddenLabels.includes(row.label) ? sum : sum + row.count), 0);

  return (
    <PieChart
      height={280}
      slots={{ pieArcLabel: ContrastArcLabel }}
      slotProps={{ legend: { toggleVisibilityOnClick: true } }}
      hiddenItems={rows.flatMap((row, dataIndex) =>
        hiddenLabels.includes(row.label) ? [{ seriesId: SERIES_ID, dataIndex }] : []
      )}
      onHiddenItemsChange={(items) =>
        setHiddenLabels(
          rows.filter((_, index) => items.some((item) => item.dataIndex === index)).map((row) => row.label)
        )
      }
      series={[
        {
          id: SERIES_ID,
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
