import HYFLogo from '../assets/HYF_logo.svg';
import { useGoogleLogin } from '@react-oauth/google';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess:async (response) => {
      try{
        await fetch(
          "/api/auth/login",
          {
            method: 'POST',
            body: JSON.stringify({ token: response.access_token }),  
            headers: {
              'Content-Type': 'application/json'
            }          
          }
        ).then((response) => response.json());    

        const user = await fetch('/api/auth/session').then((response) => response.json());

        console.log("Successfully logged in!", user);
        navigate('/');
      }
      catch(err){
        console.log(err);
      }
    },

    onError: (error) => {
      console.log('Login Failed:', error);
    }
  });

  return (
    <div className='login-container'>
      <img src={HYFLogo} alt="HYF logo" className="hyf-logo-img"/>
      <div className='login-button'>
        <Stack spacing={2} direction="column">
          <Button onClick={() => login()} variant="contained">Login with Google</Button>
        </Stack>
      </div>
    </div>
  );
}

export default LoginPage;
