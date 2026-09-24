import { readdirSync } from 'node:fs'
import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'
import prettierConfig from './prettier.config.mjs'

const journeyDirs = readdirSync('server/forms', { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)

export default [
  ...hmppsConfig({
    extraIgnorePaths: ['test_results/', 'packages/*/dist/'],
  }),
  {
    ignores: ['test_results/**', 'packages/*/dist/**'],
  },
  {
    // Journeys own their source and consume platform capabilities through the SDK.
    files: ['server/forms/**/*.{js,mjs,cjs,ts,tsx}'],
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: journeyDirs.map(dir => ({
            target: `./server/forms/${dir}`,
            from: './',
            except: [`./server/forms/${dir}`, './packages/aap-sdk', './node_modules'],
            message:
              'Journeys may import only themselves, @ministryofjustice/hmpps-aap-sdk/*, Forge and their own dependencies.',
          })),
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-param-reassign': 'off',
      'prefer-destructuring': 'off',
      'import/prefer-default-export': 'off',
      'import/no-cycle': 'off',
      'import/no-unresolved': ['error', { ignore: ['^aap:'] }],
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
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['server/forms/**/*.{js,mjs,cjs}', 'packages/aap-sdk/src/utils/browser/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        CustomEvent: 'readonly',
        HTMLElement: 'readonly',
        MutationObserver: 'readonly',
        customElements: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      'default-case': 'off',
      'max-classes-per-file': 'off',
      'no-console': 'off',
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
