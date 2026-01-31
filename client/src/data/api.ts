import axios, { AxiosError } from 'axios';

/**
 * AUTH
 */

export const getCurrentSession = async () => {
  '/auth/session';
  const { data } = await axios.get('/api/auth/session');
  return data;
};
