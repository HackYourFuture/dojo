import { AppBar, Box, Container, IconButton, Toolbar } from '@mui/material';

import HYFLogo from '../assets/hyf-logo-beige.png';
import { Link } from 'react-router';
import MenuIcon from '@mui/icons-material/Menu';
import { NavBarActions } from './NavBar/actions/NavBarActions';
import { useAuth } from '../auth/hooks/useAuth';

interface ResponsiveNavBarProps {
  onMenuClick: () => void;
}

/**
 * Component for displaying the navigation bar on top of all pages.
 *
 * @param {() => void} onMenuClick called when the menu button, shown on smaller screens, is clicked.
 * @returns {ReactNode} A React element that renders a nav bar to each page, above the sidebar.
 */
export const ResponsiveNavBar = ({ onMenuClick }: ResponsiveNavBarProps) => {
  const { user } = useAuth();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#5E1600', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {user && (
            <IconButton
              color="inherit"
              aria-label="Open main menu"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 1, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box component="div" sx={{ mr: 2 }}>
            <Link to="/home">
              <img src={HYFLogo} height="40" alt="HYF navbar logo" className="hyf-navbar-logo-img" />
            </Link>
          </Box>
          {user && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <NavBarActions />
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
