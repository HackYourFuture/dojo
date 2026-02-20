/**
 * tanstackClient.ts
 *
 * - This module creates and exports a single `QueryClient` (and its
 *   `QueryCache`) for the whole app. The client is stable and shared.
 * - It exposes `setNavigateTo(fn)` so a React Router `navigate` function
 *   can be registered at runtime. The registered function is used by the
 *   `onError` handler below to redirect on authentication errors (401).
 *
 * Chain of events (how it works, short):
 * 1. `TanStackQueryProvider` registers the router `navigate` by calling
 *    `setNavigateTo(navigate)` inside an effect.
 * 2. When a query/mutation error happens, `queryCache.onError` runs.
 * 3. If the error looks like an Axios 401, the handler calls the stored
 *    `navigateTo('/login', { replace: true })` to send the user to login.
 * 4. When the provider unmounts, it should call `resetNavigateTo()` to
 *    clear the stored function and avoid stale references.
 *
 * Quick notes:
 * - This is intentionally a module-scoped singleton to keep the cache
 *   stable across the app. That simplifies global error handling.
 * - Because it uses module-level state, tests or HMR environments may
 *   want to call `resetNavigateTo()` or mock `setNavigateTo`.
 */

import { QueryCache, QueryClient } from '@tanstack/react-query';

import { AxiosError } from 'axios';

// Type for the optional stored navigate function
type NavigateFn = ((to: string, opts?: { replace?: boolean; state?: unknown }) => void) | null;

// Holds the router navigate function when the provider registers it.
let navigateTo: NavigateFn = null;

// Called by the provider to register the `navigate` function.
export const setNavigateTo = (fn: NavigateFn) => {
  navigateTo = fn;
};

// Clears the stored navigate function. Use in cleanup or tests.
export const resetNavigateTo = () => {
  navigateTo = null;
};

const handleError = (error: unknown) => {
  const axiosError = error as AxiosError | undefined;
  // If the backend returned 401, redirect to login using the stored navigate.
  // If `navigateTo` is not set (e.g. during tests), this is a no-op.
  if (axiosError?.response?.status === 401) {
    navigateTo?.('/login', { replace: true });
  }
};

// Centralized QueryCache. Global error handling happens here.
const queryCache = new QueryCache({
  onError: handleError,
});

// App-wide QueryClient using the cache above. Import and pass this to
// `QueryClientProvider` in the application's root.
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: { retry: 1 },
    mutations: { retry: 1, onError: handleError },
  },
});
