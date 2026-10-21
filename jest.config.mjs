const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true }] },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@ministryofjustice/hmpps-aap-sdk/(.*)$': '<rootDir>/packages/aap-sdk/src/$1',
    '^@ministryofjustice/hmpps-arns-sentence-plan$':
      '<rootDir>/node_modules/@ministryofjustice/hmpps-arns-sentence-plan/src/index.ts',
    '^@ministryofjustice/hmpps-arns-sentence-plan/(.*)$':
      '<rootDir>/node_modules/@ministryofjustice/hmpps-arns-sentence-plan/src/$1',
  },

  // keep your existing bits:
  collectCoverageFrom: ['{server,packages}/**/*.{ts,js,jsx,mjs}', '!server/forms/**'],
  testMatch: ['<rootDir>/(server|packages)/**/?(*.)(cy|test).{ts,js,jsx,mjs}'],
  testPathIgnorePatterns: ['/node_modules/'],
  // Rehearsal: the installed Sentence Plan package ships TypeScript source, so it has to be compiled too.
  transformIgnorePatterns: ['/node_modules/(?!@ministryofjustice/hmpps-arns-sentence-plan/)'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test_results/jest/' }],
    ['./node_modules/jest-html-reporter', { outputPath: 'test_results/unit-test-reports.html' }],
  ],
  moduleFileExtensions: ['web.js', 'js', 'json', 'node', 'ts', 'tsx'],
}

export default config
