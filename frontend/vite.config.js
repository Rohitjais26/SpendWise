// frontend-vite/vite.config.js (Verify the content is EXACTLY this)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ // <-- This export structure is vital
  plugins: [react()],
  server: {
    // CRITICAL: The proxy configuration block
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // <-- Ensure port 5000
        changeOrigin: true,
        secure: false, 
      },
    },
  },
});