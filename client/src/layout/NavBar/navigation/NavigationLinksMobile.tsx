import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import { NAVIGATION_LINKS } from './constants';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const NavigationLinksMobile: React.FC = () => {
  const navigate = useNavigate();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  /**
   * Function to handle opening the navigation burger menu onClick event.
   *
   * @param {HTMLElement} event the click event coming from the user.
   */
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  /**
   * Function to handle closing the navigation burger menu onClick event.
   */
  const handleCloseNavMenu = () => {
    setMenuAnchor(null);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };
  const menuId = 'main-menu-appbar';
  return (
    <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size="large"
        aria-label="menu of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
        sx={{ p: 0 }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(menuAnchor)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {NAVIGATION_LINKS.map((link) => (
          <MenuItem key={link.name}>
            <Button
              onClick={() => handleNavClick(link.path)}
              sx={{
                color: 'inherit',
                display: 'block',
                textAlign: 'center',
              }}
            >
              {link.name}
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
