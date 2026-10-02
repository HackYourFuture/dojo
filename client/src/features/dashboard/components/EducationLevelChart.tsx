import { darken, lighten } from '@mui/material/styles';
import { DistributionPieChart } from './DistributionPieChart';
import { EducationLevel } from '../../../data/types/Trainee';
import { EducationLevelCount } from '../models/dashboard';
import { useTheme } from '@mui/material';

// None to PhD, the order of the shades.
const LEVELS = Object.values(EducationLevel);

interface EducationLevelChartProps {
  rows: EducationLevelCount[];
}

export const EducationLevelChart = ({ rows }: EducationLevelChartProps) => {
  const { palette } = useTheme();
  const primary = palette.primary.main;
  // Shades of the primary color, from the lightest for None to the darkest for PhD.
  const shades = [
    lighten(primary, 0.6),
    lighten(primary, 0.4),
    lighten(primary, 0.2),
    primary,
    darken(primary, 0.25),
    darken(primary, 0.5),
  ];

  return (
    <DistributionPieChart
      rows={rows.map((row) => ({
        ...row,
        color: row.educationLevel ? shades[LEVELS.indexOf(row.educationLevel)] : palette.grey[500],
      }))}
    />
  );
};
