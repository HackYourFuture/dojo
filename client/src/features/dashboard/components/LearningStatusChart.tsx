import { DistributionPieChart } from './DistributionPieChart';
import { LearningStatus } from '../../../data/types/Trainee';
import { learningStatusToLabel } from '../../../data/labels/traineeLabels';
import { useTheme } from '@mui/material';

interface LearningStatusChartProps {
  rows: { status: LearningStatus; count: number }[];
}

export const LearningStatusChart = ({ rows }: LearningStatusChartProps) => {
  const { palette } = useTheme();
  // Same colors as the learning status chips.
  const colors: Record<LearningStatus, string> = {
    [LearningStatus.Studying]: palette.info.main,
    [LearningStatus.Graduated]: palette.success.main,
    [LearningStatus.OnHold]: palette.warning.main,
    [LearningStatus.Quit]: palette.error.main,
  };

  return (
    <DistributionPieChart
      rows={rows.map((row) => ({
        label: learningStatusToLabel(row.status),
        count: row.count,
        color: colors[row.status],
      }))}
    />
  );
};
