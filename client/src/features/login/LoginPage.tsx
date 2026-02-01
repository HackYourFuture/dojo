import { Button, Stack } from '@mui/material';

import { ErrorBox } from '../../components';
import HYFLogo from '../../assets/hyf-logo-red.png';
import { useAuth } from '../../auth/hooks/useAuth';

/**
 * Component for displaying the login page elements.
 */
const LoginPage = () => {
  const { login, errorMessage } = useAuth();
  return (
    <div className="login-container">
      <img src={HYFLogo} alt="HYF logo" className="hyf-logo-img" />
      <div className="login-button">
        <Stack spacing={2} direction="column">
          <Button onClick={() => login()} variant="contained">
            Login with Google
          </Button>
        </Stack>
      </div>
      {errorMessage && <ErrorBox errorMessage={errorMessage} />}
    </div>
  );
};

export default LoginPage;
