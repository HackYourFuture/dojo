import * as React from 'react';

import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip } from '@mui/material';

import HYFLogo from '../assets/hyf-logo-beige.png';
import { Link } from 'react-router-dom';
import { NavBarActions } from './NavBar/actions/NavBarActions';
import { NavigationLinksDesktop } from './NavBar/navigation/NavigationLinksDesktop';
import { NavigationLinksMobile } from './NavBar/navigation/NavigationLinksMobile';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Component for displaying a responsive navigation menu to all pages.
 *
 * @returns {ReactNode} A React element that renders a nav bar to each page and a burger menu on smaller screens.
 */
export const ResponsiveNavBar = () => {
  const { user } = useAuth();

  return user ? (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#5E1600' }}>
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Box component="div">
              <Link to="/home">
                <img src={HYFLogo} height="40" alt="HYF navbar logo" className="hyf-navbar-logo-img" />
              </Link>
            </Box>

            <NavigationLinksDesktop />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}></Box>
            <NavigationLinksMobile />
            <NavBarActions />
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  ) : null;
};
