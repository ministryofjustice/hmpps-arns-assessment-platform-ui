import { defineConfig, devices } from '@playwright/test'

export interface PlaywrightExtendedConfig {
  apis: {
    hmppsAuth: {
      url: string
      systemClientId: string
      systemClientSecret: string
    }
    aapApi: {
      url: string
    }
    handoverApi: {
      url: string
    }
    coordinatorApi: {
      url: string
    }
  }
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<PlaywrightExtendedConfig>({
  outputDir: './test_results/playwright/test-output',
  testDir: './integration_tests/specs',
  /* Maximum time one test can run for. (millis) */
  timeout: 3 * 60 * 1000,
  /* Maximum time test suite canm run for. (millis) */
  globalTimeout: 60 * 60 * 1000,
  fullyParallel: true,
  workers: 6,
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
    launchOptions: {
      slowMo: 150,
      args: process.env.CI
        ? ['--unsafely-treat-insecure-origin-as-secure=http://hmpps-auth:9090,http://ui:3000,http://wiremock:8080']
        : [],
    },
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'off' : 'on',
    ...devices['Desktop Edge'],
    testIdAttribute: 'data-qa',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    apis: {
      hmppsAuth: {
        url: process.env.HMPPS_AUTH_URL || 'http://localhost:9091/auth',
        systemClientId: process.env.CLIENT_CREDS_CLIENT_ID || 'hmpps-arns-assessment-platform-ui-e2e',
        systemClientSecret: process.env.CLIENT_CREDS_CLIENT_SECRET || 'clientsecret',
      },
      aapApi: {
        url: process.env.AAP_API_URL || 'http://localhost:8080',
      },
      handoverApi: {
        url: process.env.HANDOVER_API_URL || 'http://localhost:9091/handover',
      },
      coordinatorApi: {
        url: process.env.COORDINATOR_API_URL || 'http://localhost:9091/coordinator-api',
      },
    },
  },

  /* Configure projects */
  projects: [
    {
      name: 'parallel',
      grepInvert: /@serial/,
    },
    {
      name: 'serial',
      grep: /@serial/,
      dependencies: ['parallel'],
      fullyParallel: false,
      workers: 1,
    },
  ],
  tsconfig: './integration_tests/tsconfig.json',
})
