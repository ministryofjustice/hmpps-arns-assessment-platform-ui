import { CoverageReportOptions } from 'monocart-coverage-reports'

// https://github.com/cenfun/monocart-coverage-reports
const coverageOptions: CoverageReportOptions = {
  name: 'My Playwright Coverage Report',

  reports: ['console-details', 'v8', 'lcovonly'],

  entryFilter: {
    '**/node_modules/**': false,
    '**/sentence-plan/**': true,
    '**/assets/**': false,
    '**/auth/**': false,
    '**/*.css': false,
  },

  sourceFilter: {
    '**/node_modules/**': false,
    '**/sentence-plan/**': true,
    '**/assets/**': false,
    '**/auth/**': false,
    '**/*.css': false,
  },

  outputDir: './coverage-reports',
}

export default coverageOptions
