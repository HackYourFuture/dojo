import HYFLogo from '../assets/HYF_logo.svg';
import axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function LoginPage() {
  const login = useGoogleLogin({
    onSuccess:async (response) => {
      try{
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers:{
              Authorization: `Bearer ${response.access_token}`,
              Accept: 'application/json'
            },
          }
        );
        console.log(res);
      }
      catch(err){
        console.log(err);
      }
    },

    onError: (error) => {
      console.log('Login Failed:', error);
    }
  });

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
  };

  return (
    <div className='login-container'>
      <img src={HYFLogo} alt="HYF logo" className="hyf-logo-img"/>
      <div className='login-button'>
        <Stack spacing={2} direction="column">
          <Button onClick={() => login()} variant="contained">Login with Google</Button>
          <Button onClick={logOut} variant="outlined">Log out</Button>
        </Stack>
      </div>
    </div>
  );
}

export default LoginPage
