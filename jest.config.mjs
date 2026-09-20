const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true }] },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  moduleNameMapper: {
    '^@ministryofjustice/hmpps-aap-sdk/(.*)$': '<rootDir>/packages/aap-sdk/src/$1',
  },

  // keep your existing bits:
  collectCoverageFrom: ['{server,packages}/**/*.{ts,js,jsx,mjs}', '!server/forms/**'],
  testMatch: ['<rootDir>/(server|packages|esbuild)/**/?(*.)(cy|test).{ts,js,jsx,mjs}'],
  testPathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test_results/jest/' }],
    ['./node_modules/jest-html-reporter', { outputPath: 'test_results/unit-test-reports.html' }],
  ],
  moduleFileExtensions: ['web.js', 'js', 'json', 'node', 'ts', 'tsx'],
}

export default config
