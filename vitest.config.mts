import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        root: rootDir,
        resolve: {
          alias: {
            '@': path.join(rootDir, 'apps/plateUI'),
          },
        },
        test: {
          name: 'plateUI',
          environment: 'node',
          include: ['apps/plateUI/app/**/*.test.ts'],
        },
      },
      {
        root: rootDir,
        resolve: {
          alias: {
            '@': path.join(rootDir, 'apps/plateServer/src'),
          },
        },
        test: {
          name: 'plateServer',
          environment: 'node',
          include: ['apps/plateServer/src/**/*.test.ts'],
        },
      },
    ],
  },
});
