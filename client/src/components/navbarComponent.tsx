import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import HYFLogo from '../assets/HYF_logo.svg';

function NavbarComponent() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Toolbar>
          <Box component="div" sx={{ flexGrow: 1 }}>
            <img src={HYFLogo} height='60' alt="HYF logo"/>
          </Box>
          <Stack direction= "row" spacing={2}>
            <Button href={`/search`} color="inherit">Search</Button>
            <Button href={`/login`} color="inherit">Login</Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavbarComponent
