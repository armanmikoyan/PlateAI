import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import checkFile from 'eslint-plugin-check-file';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'server/**']),
  {
    files: ['app/**/*.{ts,tsx}', 'lib/**/*.ts'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/app/components/**': 'KEBAB_CASE',
        },
        {
          ignoreWords: ['app', 'components'],
        },
      ],
    },
  },
  ...tseslint.config({
    files: ['**/app/components/**/constants.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE'],
        },
        {
          selector: 'objectLiteralProperty',
          format: ['UPPER_CASE'],
        },
      ],
    },
  }),
  eslintConfigPrettier,
]);
