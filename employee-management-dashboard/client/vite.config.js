import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy /api calls to the Express server during development so the
    // browser never hits CORS and we can use relative URLs in the client.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
