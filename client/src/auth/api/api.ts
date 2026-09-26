import { GoogleLoginRequest, SessionResponse } from './types';

import axios from 'axios';
import { mapSessionToDomain } from './mapper';

export const loginWithGoogle = async (authCode: string, redirectURI: string) => {
  const request: GoogleLoginRequest = { authCode, redirectURI };
  const { data } = await axios.post<SessionResponse>('/api/auth/login/google', request);
  return mapSessionToDomain(data);
};

export const logoutSession = async () => {
  await axios.post('/api/auth/logout');
};

export const refreshSession = async () => {
  await axios.post('/api/auth/refresh');
};
