import * as React from 'react';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { Link, Navigate } from 'react-router-dom';

import HYFLogo from '../assets/hyf-logo-beige.png';
import MenuIcon from '@mui/icons-material/Menu';
import { NavigationLinks } from './NavBar/NavigationLinks';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Component for displaying a responsive navigation menu to all pages.
 *
 * @returns {ReactNode} A React element that renders a nav bar to each page and a burger menu on smaller screens.
 */
export const ResponsiveNavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { logout, user } = useAuth();

  const navigate = useNavigate();
  /**
   * Function to handel opening the navigation burger menu onClick event.
   *
   * @param {HTMLElement} event the click event coming form user.
   */
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  /**
   * Function to handel closing the navigation burger menu onClick event.
   */
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  /**
   * Function to handel opening the user menu onClick event.
   *
   * @param {HTMLElement} event the click event coming form user.
   */
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Function to handel closing the user menu onClick event.
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#5E1600' }}>
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Box component="div">
              <Link to="/home">
                <img src={HYFLogo} height="40" alt="HYF navbar logo" className="hyf-navbar-logo-img" />
              </Link>
            </Box>

            <NavigationLinks />

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}></Box>
            <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{ p: 0 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="main-menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem key="Home">
                  <Button
                    onClick={() => navigate('/home')}
                    sx={{
                      color: 'inherit',
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    Home
                  </Button>
                </MenuItem>
                <MenuItem key="Cohorts">
                  <Button
                    onClick={() => navigate('/cohorts')}
                    sx={{
                      color: 'inherit',
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    Cohorts
                  </Button>
                </MenuItem>
                <MenuItem key="Dashboard">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      color: 'inherit',
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    Dashboard
                  </Button>
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
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
                <MenuItem key="Login">
                  <Button href={`/login`} color="inherit">
                    Login
                  </Button>
                </MenuItem>
                <MenuItem key="Logout">
                  <Button onClick={() => logout()} color="inherit">
                    Log out
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};
