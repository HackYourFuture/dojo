import { Outlet, useNavigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { loginWithGoogle, logoutSession } from '../api/api';
import { useCallback, useMemo, useState } from 'react';

import { ApiContext } from './useAuth';
import { AxiosError } from 'axios';
import { Loader } from '../../components';
import { useLocalStorage } from './useLocalStorage';

export const ApiProvider = () => {
  const [user, setUser] = useLocalStorage('user', null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {
        setLoading(true);
        const user = await loginWithGoogle(response.code, new URL(window.location.href).origin);
        console.log('Successfully logged in!', user);
        setUser(user);
        navigate('/', { replace: true });
      } catch (error) {
        console.log('Error logging in:', error);

        if (error instanceof AxiosError)
          setErrorMessage(`Error code: ${error.response?.status} ${error.response?.data?.error}`);
        console.log(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
      setErrorMessage(error.error_description || 'An error occurred');
    },
  });

  // call this function to sign out logged in user
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      await logoutSession();
      googleLogout();
      setUser(null);
      console.log('Successfully logged out!');
      navigate('/', { replace: true });
    } catch (error) {
      console.log('Error logging out:', error);

      if (error instanceof AxiosError)
        setErrorMessage(`Error code: ${error.response?.status} ${error.response?.data?.error}`);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate, errorMessage]);

  const value = useMemo(
    () => ({
      user,
      errorMessage,
      login,
      logout,
    }),
    [user, errorMessage, login, logout]
  );

  return <ApiContext.Provider value={value}>{loading ? <Loader /> : <Outlet />}</ApiContext.Provider>;
};
