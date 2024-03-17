import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Automatically open the app in the browser on server start.
    open: '/',

    // Proxy /api requests to the API server. This will avoid any CORS issues.
    proxy: {
      '/api': 'http://localhost:7777',
      '/api-docs': 'http://localhost:7777',
    },
  },
})
