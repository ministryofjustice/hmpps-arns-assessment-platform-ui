import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'
import prettierConfig from './prettier.config.mjs'

export default [
  ...hmppsConfig({
    extraIgnorePaths: ['test_results/', 'server/forms/**/components/**/*.mjs'],
    extraPathsAllowingDevDependencies: ['**/*.ct.ts', '**/*.fixtures.ts'],
  }),
  {
    ignores: ['test_results/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-param-reassign': 'off',
      'prefer-destructuring': 'off',
      'import-x/prefer-default-export': 'off',
      'import-x/no-cycle': 'off',
      'no-plusplus': 'off',
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
  {
    files: ['**/test-utils/**/*.ts', '**/test-utils/**/*.js'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  {
    files: ['integration_tests/**/*.ts', '**/*.ct.ts', 'playwright.config.ts'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './integration_tests/tsconfig.json',
        },
      },
    },
  },
  {
    files: ['**/*.ct.ts', '**/*.fixtures.ts'],
    rules: {
      'no-empty-pattern': 'off',
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
      'import-x/namespace': 'off',
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
