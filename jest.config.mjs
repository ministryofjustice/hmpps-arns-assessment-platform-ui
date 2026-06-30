const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true }] },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  // keep your existing bits:
  collectCoverageFrom: ['server/**/*.{ts,js,jsx,mjs}', '!server/forms/**'],
  testMatch: ['<rootDir>/server/**/?(*.)(cy|test).{ts,js,jsx,mjs}'],
  testPathIgnorePatterns: ['/node_modules/'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test_results/jest/' }],
    ['./node_modules/jest-html-reporter', { outputPath: 'test_results/unit-test-reports.html' }],
  ],
  moduleFileExtensions: ['web.js', 'js', 'json', 'node', 'ts'],
}

export default config
