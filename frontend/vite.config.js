import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/expenses': 'http://localhost:5001',
      '/groups': 'http://localhost:5001',
    },
  },
});
