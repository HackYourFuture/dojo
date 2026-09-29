import { Box } from '@mui/material';
import { NavBarSearch } from '../../../features/search/NavBarSearch';
import React from 'react';
import { useLocation } from 'react-router-dom';

export const NavBarActions: React.FC = () => {
  const { key } = useLocation();

  return (
    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Keyed by page, so the search starts empty on every page and closes after picking a result. */}
      <NavBarSearch key={key} />
    </Box>
  );
};
