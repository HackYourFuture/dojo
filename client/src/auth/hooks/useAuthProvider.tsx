import { Outlet, useNavigate } from 'react-router';
import { getSession, loginWithGoogle, logoutSession } from '../api/api';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiContext } from './useAuth';
import { AxiosError } from 'axios';
import { ErrorBox, Loader } from '../../components';
import { User } from './User';

// The message is the server's text (see data/http/interceptors.ts), or axios' own when there is no response.
const toErrorMessage = (error: AxiosError) =>
  error.response ? `Error code: ${error.response.status} ${error.message}` : error.message;

export const ApiProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sessionError, setSessionError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getSession()
      .then(setUser)
      .catch((error) => {
        // Only a 401 means signed out. Anything else is the server failing, even after the retries.
        if (error instanceof AxiosError && error.response?.status === 401) {
          setUser(null);
        } else {
          setSessionError(`The server is not available. Refresh the page to try again. ${toErrorMessage(error)}`);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {
        setLoading(true);
        const user = await loginWithGoogle(response.code, new URL(window.location.href).origin);
        console.log('Successfully logged in as ', user.name);
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

  // Without a known session every page would redirect to the login page, so show the error instead.
  const content = sessionError ? (
    <ErrorBox errorMessage={sessionError} sx={{ maxWidth: 400, margin: '20vh auto' }} />
  ) : (
    <Outlet />
  );

  return <ApiContext.Provider value={value}>{loading ? <Loader /> : content}</ApiContext.Provider>;
};
