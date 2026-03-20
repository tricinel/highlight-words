import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['./__tests__/src/*.test.ts'],
    environment: 'node'
  }
});
