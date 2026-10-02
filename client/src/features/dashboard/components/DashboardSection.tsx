import { Grid, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface DashboardSectionProps {
  title: string;
  // Grid items, one per card.
  children: ReactNode;
}

export const DashboardSection = ({ title, children }: DashboardSectionProps) => {
  return (
    <section>
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </section>
  );
};
