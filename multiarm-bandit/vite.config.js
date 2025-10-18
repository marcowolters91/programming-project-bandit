import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/programming-project-bandit/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
