import { Box, Button, Stack } from '@mui/material';

import { NAVIGATION_LINKS } from './constants';
import { useNavigate } from 'react-router-dom';

export const NavigationLinksDesktop: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      <Stack direction="row" spacing={2}>
        {NAVIGATION_LINKS.map((link) => (
          <Button key={link.name} onClick={() => navigate(link.path)} sx={{ my: 2, color: 'white', display: 'block' }}>
            {link.name}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};
