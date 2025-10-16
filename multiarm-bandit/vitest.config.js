import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const repoName = 'programming-project-bandit';

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    exclude: ['node_modules', 'tests/e2e/**', 'playwright.config.*', 'eslint.config.*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'tests/**',
        'tests/e2e/**',
        'playwright.config.*',
        'eslint.config.*',
        '**/vite.config.*',
        '**/vitest.config.*',
      ],
    },
  },
});
