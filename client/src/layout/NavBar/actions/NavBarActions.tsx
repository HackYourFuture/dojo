import { Avatar, Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';

import { DarkModeToggle } from '../../../features/dark-mode/DarkModeToggle';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const NavBarActions: React.FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { logout, user } = useAuth();

  const navigate = useNavigate();

  /**
   * Function to handle opening the user menu onClick event.
   *
   * @param {HTMLElement} event The click event coming from the user.
   */
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Function to handle closing the user menu onClick event.
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
      <DarkModeToggle />
      <IconButton onClick={() => navigate('/search')} size="large" aria-label="search" color="inherit">
        <SearchIcon />
      </IconButton>
      <Tooltip title="Open user menu">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={user?.name ?? 'User image'} src={user?.imageUrl ?? ''} />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: '45px' }}
        id="user-menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem key="Logout">
          <Button onClick={() => logout()} color="inherit">
            Log out
          </Button>
        </MenuItem>
      </Menu>
    </Box>
  );
};
