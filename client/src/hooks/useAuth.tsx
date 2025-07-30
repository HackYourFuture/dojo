import { createContext, useContext, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useLocalStorage } from '.';
import { Loader } from '../components';
import axios, { AxiosError } from 'axios';
import { User } from '../models';

interface AuthContextType {
  user: User | null;
  errorMessage: string;
  login: () => void;
  logout: () => Promise<void>;
}

export const ApiContext = createContext<AuthContextType | null>(null);

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
        await axios.post('/api/auth/login', {
          authCode: response.code,
          redirectURI: new URL(window.location.href).origin,
        });
        const { data } = await axios.get('/api/auth/session');
        if (data) {
          console.log('Successfully logged in!', data);
          setUser(data);
          navigate('/', { replace: true });
        }
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
  const logout = async () => {
    try {
      setLoading(true);

      await axios.post('/api/auth/logout');
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
  };

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

export const useAuth = (): AuthContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useAuth must be used within an ApiProvider');
  }

  return context;
};
