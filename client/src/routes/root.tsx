import { Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ResponsiveNavBar } from '../components';
import { TanStackQueryProvider } from '../data/tanstack/TanStackQueryProvider';

/**
 * The main root element where we display the navigation and routes.
 */
export default function Root() {
  return (
    <>
      <TanStackQueryProvider>
        <div id="navbar">
          <ResponsiveNavBar />
        </div>
        <div id="detail">
          <Outlet />
        </div>

        {/* react query debugger */}
        <ReactQueryDevtools initialIsOpen={false} />
      </TanStackQueryProvider>
    </>
  );
}
