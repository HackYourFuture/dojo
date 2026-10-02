import { Paper, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
}

export const DashboardCard = ({ title, children }: DashboardCardProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};
