import { GoogleLoginRequest, SessionResponse } from './types';

import { MutationObserver } from '@tanstack/react-query';
import axios from 'axios';
import { mapSessionToDomain } from './mapper';
import { queryClient } from '../../data/tanstack/tanstackClient';

// Runs the request as a TanStack mutation
const withRetries = <T>(request: () => Promise<T>) => {
  const observer = new MutationObserver(queryClient, { mutationFn: request });
  // Detaching the observer lets the cache drop the finished mutation.
  return observer.mutate().finally(() => observer.reset());
};

export const loginWithGoogle = (authCode: string, redirectURI: string) =>
  withRetries(async () => {
    const request: GoogleLoginRequest = { authCode, redirectURI };
    const { data } = await axios.post<SessionResponse>('/api/auth/login/google', request);
    return mapSessionToDomain(data);
  });

export const logoutSession = () =>
  withRetries(async () => {
    await axios.post('/api/auth/logout');
  });

export const refreshSession = () =>
  withRetries(async () => {
    await axios.post('/api/auth/refresh');
  });

// Runs as a query, so it gets the same retries.
export const getSession = () =>
  queryClient.query({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await axios.get<SessionResponse>('/api/auth/session');
      return mapSessionToDomain(data);
    },
  });
