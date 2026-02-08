import { Box, Button } from '@mui/material';

import { ErrorBox } from '../../components';
import HYFLogo from '../../assets/hyf-logo-red.png';
import { useAuth } from '../../auth/hooks/useAuth';

/**
 * Component for displaying the login page elements.
 */
const LoginPage = () => {
  const { login, errorMessage } = useAuth();
  return (
    <Box
      sx={{
        paddingTop: '20vh',
        maxWidth: 400,
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <img src={HYFLogo} alt="HYF logo" className="hyf-logo-img" />

      <Button
        onClick={() => login()}
        variant="contained"
        fullWidth
        sx={{ alignSelf: 'center', padding: 2, minWidth: 300 }}
      >
        Login with Google
      </Button>

      {errorMessage && <ErrorBox errorMessage={errorMessage} />}
    </Box>
  );
};

export default LoginPage;
