import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/.{git,cache}/**',
      '**/{vite,vitest,build}.config.*'
    ],
    include: ['./__tests__/dist/*.test.ts'],
    environment: 'node'
  }
});
