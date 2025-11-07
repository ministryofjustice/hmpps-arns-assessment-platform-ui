import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig(),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-param-reassign': 'off',
      'import/prefer-default-export': 'off',
      'import/no-cycle': 'off',
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
    files: ['playwright.config.ts'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
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
