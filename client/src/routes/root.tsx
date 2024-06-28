import { Outlet } from "react-router-dom";
import { ResponsiveNavBar } from "../components";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

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
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}
