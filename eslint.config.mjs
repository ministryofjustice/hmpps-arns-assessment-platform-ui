import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig({
    extraIgnorePaths: ['test_results/', 'assets/**'],
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
  },
  {
    files: ['packages/form-engine-moj-components/**/*.ts'],
    rules: {
      'no-nested-ternary': 'off',
    },
  },
  {
    files: ['packages/form-engine-govuk-components/**/*.ts'],
    rules: {
      'no-nested-ternary': 'off',
    },
  },
  {
    name: 'prettier-overrides',
    rules: {
      'prettier/prettier': [
        'warn',
        {
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          semi: false,
          arrowParens: 'avoid',
          alignObjectProperties: 'none',
          returnParentheses: false,
          plugins: ['@yikes2000/prettier-plugin-merge-extras'],
        },
      ],
    },
  },
]
