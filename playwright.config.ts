import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv'
// dotenv.config({ path: path.resolve(__dirname, '.env') })

/**
 * Custom configuration values for tests.
 */
export const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
export const wiremockUrl = process.env.WIREMOCK_URL || 'http://localhost:9091/__admin'

// noinspection JSUnusedGlobalSymbols
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  outputDir: './test_results/playwright/test-output',
  /* Maximum time one test can run for. (millis) */
  timeout: 3 * 60 * 1000,
  /* Maximum time test suite can run for. (millis) */
  globalTimeout: 60 * 60 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test_results/playwright/report', open: process.env.CI ? 'never' : 'on-failure' }],
    ['junit', { outputFile: 'test_results/playwright/junit.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 30 /* seconds */ * 1000,
    timezoneId: 'Europe/London',
    launchOptions: { slowMo: 150 },
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'off' : 'on',
    ...devices['Desktop Chrome'],
    testIdAttribute: 'data-qa',
    baseURL: baseUrl,
  },

  /* Configure projects */
  projects: [
    {
      name: 'integration',
      testDir: './integration_tests/specs',
      /* Ensure tests run consecutively due to inability to share wiremock instance */
      workers: 1,
    },
    {
      name: 'e2e',
      testDir: './e2e_tests/specs',
      /* E2E tests can run in parallel against real services */
      workers: 2,
    },
  ],
})
