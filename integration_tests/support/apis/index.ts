import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { TestInfo } from '@playwright/test'
import { TestHmppsAuthClient } from './TestHmppsAuthClient'
import { TestAapApiClient } from './TestAapApiClient'
import { TestHandoverApiClient } from './TestHandoverApiClient'
import { TestCoordinatorApiClient } from './TestCoordinatorApiClient'

export interface TestApis {
  authClient: TestHmppsAuthClient
  aapClient: TestAapApiClient
  handoverClient: TestHandoverApiClient
  coordinatorClient: TestCoordinatorApiClient
}

export interface GetTestApisOptions {
  aapApiUrl: string
  handoverApiUrl: string
  coordinatorApiUrl: string
  hmppsAuthUrl: string
  hmppsAuthClientId: string
  hmppsAuthClientSecret: string
  testInfo?: TestInfo
}

/**
 * Create all test API clients with proper authentication.
 */
export function getTestApis(options: GetTestApisOptions): TestApis {
  const authClient = new TestHmppsAuthClient({
    url: options.hmppsAuthUrl,
    systemClientId: options.hmppsAuthClientId,
    systemClientSecret: options.hmppsAuthClientSecret,
    testInfo: options.testInfo,
  })

  const aapClient = new TestAapApiClient({
    baseUrl: options.aapApiUrl,
    authenticationClient: authClient as unknown as AuthenticationClient,
    testInfo: options.testInfo,
  })

  const handoverClient = new TestHandoverApiClient({
    baseUrl: options.handoverApiUrl,
    authenticationClient: authClient as unknown as AuthenticationClient,
    testInfo: options.testInfo,
  })

  const coordinatorClient = new TestCoordinatorApiClient({
    baseUrl: options.coordinatorApiUrl,
    authenticationClient: authClient as unknown as AuthenticationClient,
    testInfo: options.testInfo,
  })

  return {
    authClient,
    aapClient,
    handoverClient,
    coordinatorClient,
  }
}
