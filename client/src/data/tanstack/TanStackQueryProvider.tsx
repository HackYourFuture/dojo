import React, { useEffect } from 'react';
import { queryClient, resetOnSessionEnd, setOnSessionEnd } from './tanstackClient';

import { QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * TanStackQueryProvider
 *
 * - This component sits near the root of the React app and provides the
 *   shared `queryClient` (from `tanstackClient.ts`) to the app via
 *   `QueryClientProvider`.
 * - Its other job is to register what happens when the session ends, so
 *   global query errors can sign the user out and redirect them.
 *
 * Why we register the handler here:
 * - `QueryCache.onError` runs outside React hooks, so it can't call
 *   `useNavigate()` or `useAuth()` directly. The provider registers a handler
 *   once and the client calls it on a 401.
 *
 * Important: the provider clears the registered handler on unmount to
 * avoid keeping a stale reference (useful for tests or HMR).
 */
export const TanStackQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { clearUser } = useAuth();

  useEffect(() => {
    // The stored user would keep the app signed in, so forget it before going to the login page.
    setOnSessionEnd(() => {
      clearUser();
      navigate('/login', { replace: true });
    });
    return () => {
      // Clear it on cleanup to avoid stale references.
      resetOnSessionEnd();
    };
  }, [navigate, clearUser]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
