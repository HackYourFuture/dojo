import HYFLogo from '../assets/HYF_logo.svg';
import { useGoogleLogin } from '@react-oauth/google';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function LoginPage() {
  const login = useGoogleLogin({
    //TODO: send the response.access_token to the back-end so it can validate google's token, 
    //extract the user info and return a new token for all other authenticated requests.
    onSuccess:async (response) => {
      try{
        const res = await fetch(
          "http://localhost:7777/api/auth/login",
          {
            method: 'POST',
            body: JSON.stringify({ token: response.access_token }),  
            headers: {
              'Content-Type': 'application/json'
            }          
          }
        ).then((response) => response.json());    

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
