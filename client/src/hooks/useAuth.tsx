import { createContext, useContext, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

export const ApiContext = createContext<any | null>(null);

export const ApiProvider = () => {
  const [user, setUser] = useLocalStorage("user", null);

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
        setUser(user);
        navigate('/', { replace: true });
      }
      catch(err){
        console.log(err);
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
    }
  });

  // call this function to sign out logged in user
  const logout = () => {
    googleLogout();
    setUser(null);
    navigate('/', { replace: true });
  };

  const value = useMemo(() => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <ApiContext.Provider value={value}>
      <Outlet />
    </ApiContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(ApiContext);
};
