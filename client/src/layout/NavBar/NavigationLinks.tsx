import { Box, Button, Stack } from '@mui/material';

import { useNavigate } from 'react-router-dom';

const links = [
  { name: 'Home', path: '/home' },
  { name: 'Cohorts', path: '/cohorts' },
  { name: 'Dashboard', path: '/dashboard' },
];
export const NavigationLinks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      <Stack direction="row" spacing={2}>
        {links.map((link) => (
          <Button key={link.name} onClick={() => navigate(link.path)} sx={{ my: 2, color: 'white', display: 'block' }}>
            {link.name}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};
