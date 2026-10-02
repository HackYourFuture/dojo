import { IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  info?: string;
  value: number;
  children?: ReactNode;
}

export const StatCard = ({ label, info, value, children }: StatCardProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {info && (
          // Shows on hover and keyboard focus, and on a tap on a phone.
          <Tooltip title={info} arrow enterTouchDelay={0}>
            <IconButton size="small" sx={{ p: 0.25, color: 'text.secondary', cursor: 'help' }}>
              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Typography variant="h3" component="p" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      {children}
    </Paper>
  );
};
