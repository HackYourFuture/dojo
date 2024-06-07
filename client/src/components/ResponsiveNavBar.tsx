import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HYFLogo from "../assets/HYF_logo.svg";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import Container from "@mui/material/Container";
import { useAuth } from "../hooks/useAuth";

export const ResponsiveNavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const { logout } = useAuth();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Box component="div">
              <img
                src={HYFLogo}
                height="60"
                alt="HYF navbar logo"
                className="hyf-navbar-logo-img"
              />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Stack direction="row" spacing={2}>
                <Button
                  key="Home"
                  href={`/home`}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Home
                </Button>
                <Button
                  key="Cohorts"
                  href={`/cohorts`}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Cohorts
                </Button>
                <Button
                  key="Dashboard"
                  href={`/dashboard`}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Dashboard
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            ></Box>
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
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
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem key="Home">
                  <Button
                    href={`/home`}
                    sx={{
                      color: "inherit",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    Home
                  </Button>
                </MenuItem>
                <MenuItem key="Cohorts">
                  <Button
                    href={`/cohorts`}
                    sx={{
                      color: "inherit",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    Cohorts
                  </Button>
                </MenuItem>
                <MenuItem key="Dashboard">
                  <Button
                    href={`/dashboard`}
                    sx={{
                      color: "inherit",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    Dashboard
                  </Button>
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                href={`/search`}
                size="large"
                aria-label="search"
                color="inherit"
              >
                <SearchIcon />
              </IconButton>
              <Tooltip title="Open user menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User image" src="../assets/avatar/user.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="user-menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
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
