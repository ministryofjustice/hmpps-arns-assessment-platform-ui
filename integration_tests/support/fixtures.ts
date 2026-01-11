import { test as base } from '@playwright/test'
import { getTestApis } from './apis'
import type { PlaywrightExtendedConfig } from '../../playwright.config'
import {TestAapApiClient} from "./apis/TestAapApiClient";

/**
 * Test fixtures provided to tests
 */
type TestApiFixtures = {
  aapClient: TestAapApiClient
}

/**
 * Extended Playwright test with AAP API fixtures.
 *
 * @example
 * // playwright.config.ts
 * export default defineConfig({
 *   use: {
 *     apis: {
 *       hmppsAuth: {
 *         url: 'http://localhost:9090/auth',
 *         systemClientId: 'clientid',
 *         systemClientSecret: 'clientsecret',
 *       },
 *       aapApi: {
 *         url: 'http://localhost:8080',
 *       },
 *     },
 *   },
 * })
 *
 * @example
 * // your.spec.ts
 * import { test, expect } from '../support/fixtures'
 * import { AssessmentBuilder } from '../builders'
 *
 * test('can view assessment', async ({ page, aapClient }) => {
 *   const assessment = await new AssessmentBuilder()
 *     .ofType('SENTENCE_PLAN')
 *     .create(aapClient)
 *
 *   await page.goto(`/assessment/${assessment.uuid}`)
 * })
 */
export const test = base.extend<TestApiFixtures & PlaywrightExtendedConfig>({
  apis: [undefined as unknown as PlaywrightExtendedConfig['apis'], { option: true }],

  aapClient: async ({ apis }, use, testInfo) => {
    const { aapClient } = getTestApis({
      aapApiUrl: apis.aapApi.url,
      hmppsAuthUrl: apis.hmppsAuth.url,
      hmppsAuthClientId: apis.hmppsAuth.systemClientId,
      hmppsAuthClientSecret: apis.hmppsAuth.systemClientSecret,
      testInfo,
    })

    await use(aapClient)
  },
})

export { expect } from '@playwright/test'
