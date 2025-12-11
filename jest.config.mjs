const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true }] },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  moduleNameMapper: {
    '^@form-engine/(.*)$': '<rootDir>/packages/form-engine/src/$1',
    '^@form-engine-govuk-components/(.*)$': '<rootDir>/packages/form-engine-govuk-components/src/$1',
  },

  // keep your existing bits:
  collectCoverageFrom: ['{server,packages}/**/*.{ts,js,jsx,mjs}', '!server/forms/**'],
  testMatch: ['<rootDir>/(server|packages|job)/**/?(*.)(cy|test).{ts,js,jsx,mjs}'],
  testPathIgnorePatterns: ['/node_modules/', '/server/forms/'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test_results/jest/' }],
    ['./node_modules/jest-html-reporter', { outputPath: 'test_results/unit-test-reports.html' }],
  ],
  setupFilesAfterEnv: ['<rootDir>/packages/form-engine/src/test-utils/matchers.ts'],
  moduleFileExtensions: ['web.js', 'js', 'json', 'node', 'ts'],
}

export default config
