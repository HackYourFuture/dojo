import { Box, IconButton } from '@mui/material';

import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

export const NavBarActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton onClick={() => navigate('/search')} size="large" aria-label="search" color="inherit">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};
