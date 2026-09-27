import { Box, Container, Paper, SvgIcon, Typography } from '@mui/material';

import { alpha } from '@mui/material/styles';

export interface ComingSoonProps {
  title: string;
  description: string;
  icon: typeof SvgIcon;
}

/** Placeholder content for a page that is not built yet. */
export const ComingSoon = ({ title, description, icon: Icon }: ComingSoonProps) => {
  return (
    <Container fixed>
      <Box p={2}>
        <Typography variant="h4">{title}</Typography>
        <Paper
          variant="outlined"
          sx={{
            mt: 4,
            py: 8,
            px: 3,
            borderRadius: 3,
            borderStyle: 'dashed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Icon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6">Coming soon</Typography>
          <Typography color="text.secondary" maxWidth={420}>
            {description}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
