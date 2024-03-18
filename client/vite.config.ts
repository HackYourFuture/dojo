import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  console.log(env);
  const backendProxyTarget = env.VITE_BACKEND_PROXY_TARGET ?? "http://localhost:7777";
  return {
    plugins: [react()],
    server: {
      // Automatically open the app in the browser on server start.
      open: "/",

      // Proxy /api requests to the API server. This will avoid any CORS issues.
      proxy: {
        "/api": backendProxyTarget,
        "/api-docs": backendProxyTarget,
      },
    },
  };
});
