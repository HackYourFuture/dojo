import axios, { isAxiosError } from 'axios';

import { refreshSession } from '../../auth/api/api';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retriedAfterRefresh?: boolean;
  }
}

let refreshInFlight: Promise<boolean> | null = null;

// Requests that fail together share one refresh call.
const refreshOnce = () => {
  refreshInFlight ??= refreshSession()
    .then(
      () => true,
      () => false
    )
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
};

// The access token lives for 15 minutes. On a 401, renew it once and replay the request. If the session cannot be
// renewed, the original 401 reaches the query client, which sends the user to the login page.
const retryAfterRefresh = async (error: unknown) => {
  if (!isAxiosError(error) || error.response?.status !== 401 || !error.config) throw error;

  const request = error.config;
  if (request._retriedAfterRefresh || request.url?.startsWith('/api/auth/')) throw error;

  request._retriedAfterRefresh = true;
  if (!(await refreshOnce())) throw error;
  return axios(request);
};

// Error responses carry a message written for the user: { "error": "..." }.
const applyServerErrorMessage = (error: unknown) => {
  if (isAxiosError<{ error?: unknown }>(error) && typeof error.response?.data?.error === 'string') {
    error.message = error.response.data.error;
  }
  throw error;
};

export const installAxiosInterceptors = () => {
  axios.interceptors.response.use(undefined, retryAfterRefresh);
  axios.interceptors.response.use(undefined, applyServerErrorMessage);
};
