import { Outlet, useNavigate } from 'react-router-dom';
import { getSession, loginWithGoogle, logoutSession } from '../api/api';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiContext } from './useAuth';
import { AxiosError } from 'axios';
import { Loader } from '../../components';
import { User } from './User';

// The message is the server's text (see data/http/interceptors.ts), or axios' own when there is no response.
const toErrorMessage = (error: AxiosError) =>
  error.response ? `Error code: ${error.response.status} ${error.message}` : error.message;

export const ApiProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    getSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

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

        if (error instanceof AxiosError) {
          setErrorMessage(toErrorMessage(error));
        }
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

      if (error instanceof AxiosError) {
        setErrorMessage(toErrorMessage(error));
      }
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate, errorMessage]);

  const clearUser = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(
    () => ({
      user,
      errorMessage,
      login,
      logout,
      clearUser,
    }),
    [user, errorMessage, login, logout, clearUser]
  );

  return <ApiContext.Provider value={value}>{loading ? <Loader /> : <Outlet />}</ApiContext.Provider>;
};
