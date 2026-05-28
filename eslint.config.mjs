import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'
import prettierConfig from './prettier.config.mjs'

export default [
  ...hmppsConfig({
    extraIgnorePaths: ['test_results/', 'server/forms/**/components/**/*.mjs'],
  }),
  {
    ignores: ['test_results/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-param-reassign': 'off',
      'prefer-destructuring': 'off',
      'import/prefer-default-export': 'off',
      'import/no-cycle': 'off',
      'no-plusplus': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    files: ['**/test-utils/**/*.ts', '**/test-utils/**/*.js'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  {
    files: ['integration_tests/**/*.ts', 'playwright.config.ts'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './integration_tests/tsconfig.json',
        },
      },
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  {
    files: ['assets/js/**/*.js', 'assets/js/**/*.mjs'],
    rules: {
      'import/namespace': 'off',
      'no-console': 'off',
    },
  },
  {
    name: 'prettier-overrides',
    rules: {
      'prettier/prettier': ['warn', prettierConfig],
    },
  },
]
