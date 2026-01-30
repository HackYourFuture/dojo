import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AxiosError } from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TanStackQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const queryCache = React.useMemo(
    () =>
      new QueryCache({
        onError: (error: unknown, query) => {
          console.error('Global query error', { error, query });
          const axiosError = error as AxiosError | undefined;
          if (axiosError?.response?.status === 401) {
            navigate('/login', { replace: true });
          }
        },
      }),
    [navigate]
  );

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        queryCache,
        defaultOptions: {
          queries: {
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
    [queryCache]
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
