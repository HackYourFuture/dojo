import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ResponsiveNavBar } from '../components';

const queryClient = new QueryClient();

/**
 * The main root element where we display the navigation and routes.
 */
export default function Root() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div id="navbar">
          <ResponsiveNavBar />
        </div>
        <div id="detail">
          <Outlet />
        </div>

        {/* react query debugger */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
