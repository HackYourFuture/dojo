import React, { useEffect } from 'react';
import { queryClient, resetNavigateTo, setNavigateTo } from './tanstackClient';

import { QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

/**
 * TanStackQueryProvider
 *
 * - This component sits near the root of the React app and provides the
 *   shared `queryClient` (from `tanstackClient.ts`) to the app via
 *   `QueryClientProvider`.
 * - Its other job is to register React Router's `navigate` function with
 *   the singleton client so global query errors can redirect the user.
 *
 * Why we register `navigate` here:
 * - `QueryCache.onError` runs outside React hooks, so it can't call
 *   `useNavigate()` directly. The provider registers the navigate function
 *   once and the client uses it to perform redirects (e.g. on 401).
 *
 * Important: the provider clears the registered navigate on unmount to
 * avoid keeping a stale reference (useful for tests or HMR).
 */
export const TanStackQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Register the router navigate function with the singleton client.
    setNavigateTo(navigate);
    return () => {
      // Clear it on cleanup to avoid stale references.
      resetNavigateTo();
    };
  }, [navigate]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
