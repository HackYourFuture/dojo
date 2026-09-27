import { Box, Toolbar } from '@mui/material';

import { Outlet } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ResponsiveNavBar } from '../components';
import { Sidebar } from '../layout/Sidebar/Sidebar';
import { TanStackQueryProvider } from '../data/tanstack/TanStackQueryProvider';
import { useAuth } from '../auth/hooks/useAuth';
import { useState } from 'react';

/**
 * The main root element where we display the navigation and routes.
 */
export default function Root() {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <>
      <TanStackQueryProvider>
        <Box sx={{ display: 'flex' }}>
          <ResponsiveNavBar onMenuClick={() => setIsMobileSidebarOpen((isOpen) => !isOpen)} />
          {user && <Sidebar isMobileOpen={isMobileSidebarOpen} onMobileClose={() => setIsMobileSidebarOpen(false)} />}
          {/* Positioned so page loaders are centered in the content area, next to the sidebar. */}
          <Box component="main" sx={{ flexGrow: 1, minWidth: 0, minHeight: '100vh', position: 'relative' }}>
            {/* Keeps the page below the fixed nav bar. */}
            <Toolbar />
            <Outlet />
          </Box>
        </Box>

        {/* react query debugger */}
        <ReactQueryDevtools initialIsOpen={false} />
      </TanStackQueryProvider>
    </>
  );
}
