import HYFLogo from "../assets/HYF_logo.svg";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAuth } from "../hooks/useAuth";
import { ErrorBox } from "../components";

export const LoginPage = () => {
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
