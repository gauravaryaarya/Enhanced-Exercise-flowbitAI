import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    // We exclude Playwright tests (.spec.ts) so Vitest doesn't try to run them
    exclude: [...configDefaults.exclude, '**/*.spec.ts'],
  },
});