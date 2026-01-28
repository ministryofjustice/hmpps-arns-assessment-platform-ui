import AxeBuilder from '@axe-core/playwright'
import { test as base } from '@playwright/test'
import { getTestApis } from './apis'
import type { PlaywrightExtendedConfig } from '../../playwright.config'
import { TestAapApiClient } from './apis/TestAapApiClient'
import { TestHandoverApiClient } from './apis/TestHandoverApiClient'
import { TestCoordinatorApiClient } from './apis/TestCoordinatorApiClient'
import { AssessmentBuilder } from '../builders/AssessmentBuilder'
import type { AssessmentBuilderFactory } from '../builders/AssessmentBuilder'
import { SentencePlanBuilder } from '../builders/SentencePlanBuilder'
import type { SentencePlanBuilderFactory } from '../builders/SentencePlanBuilder'
import { CoordinatorBuilder } from '../builders/CoordinatorBuilder'
import type { CoordinatorBuilderFactory } from '../builders/CoordinatorBuilder'
import { HandoverBuilder } from '../builders/HandoverBuilder'
import type { HandoverBuilderFactory } from '../builders/HandoverBuilder'
import type { AccessMode } from '../../server/interfaces/handover-api/shared'

export enum TargetService {
  SENTENCE_PLAN = 'sentence-plan',
  STRENGTHS_AND_NEEDS = 'strengths-and-needs',
}

const TARGET_SERVICE_CLIENT_IDS: Record<TargetService, string> = {
  [TargetService.SENTENCE_PLAN]: 'sentence-plan',
  [TargetService.STRENGTHS_AND_NEEDS]: 'strengths-and-needs-assessment',
}

export interface CreateSessionOptions {
  targetService: TargetService
  accessMode?: AccessMode
}

export interface SessionFixture {
  handoverSessionId: string
  handoverLink: string
  oasysAssessmentPk: string
  crn: string
  sentencePlanId: string
  sentencePlanVersion: number
  sanAssessmentId: string
  sanAssessmentVersion: number
}

/**
 * Test fixtures provided to tests
 */
type TestApiFixtures = {
  aapClient: TestAapApiClient
  handoverClient: TestHandoverApiClient
  coordinatorClient: TestCoordinatorApiClient
  assessmentBuilder: AssessmentBuilderFactory
  sentencePlanBuilder: SentencePlanBuilderFactory
  coordinatorBuilder: CoordinatorBuilderFactory
  handoverBuilder: HandoverBuilderFactory
  createSession: (options: CreateSessionOptions) => Promise<SessionFixture>
  makeAxeBuilder: () => AxeBuilder
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
      handoverApiUrl: apis.handoverApi.url,
      coordinatorApiUrl: apis.coordinatorApi.url,
      hmppsAuthUrl: apis.hmppsAuth.url,
      hmppsAuthClientId: apis.hmppsAuth.systemClientId,
      hmppsAuthClientSecret: apis.hmppsAuth.systemClientSecret,
      testInfo,
    })

    await use(aapClient)
  },

  handoverClient: async ({ apis }, use, testInfo) => {
    const { handoverClient } = getTestApis({
      aapApiUrl: apis.aapApi.url,
      handoverApiUrl: apis.handoverApi.url,
      coordinatorApiUrl: apis.coordinatorApi.url,
      hmppsAuthUrl: apis.hmppsAuth.url,
      hmppsAuthClientId: apis.hmppsAuth.systemClientId,
      hmppsAuthClientSecret: apis.hmppsAuth.systemClientSecret,
      testInfo,
    })

    await use(handoverClient)
  },

  coordinatorClient: async ({ apis }, use, testInfo) => {
    const { coordinatorClient } = getTestApis({
      aapApiUrl: apis.aapApi.url,
      handoverApiUrl: apis.handoverApi.url,
      coordinatorApiUrl: apis.coordinatorApi.url,
      hmppsAuthUrl: apis.hmppsAuth.url,
      hmppsAuthClientId: apis.hmppsAuth.systemClientId,
      hmppsAuthClientSecret: apis.hmppsAuth.systemClientSecret,
      testInfo,
    })

    await use(coordinatorClient)
  },

  assessmentBuilder: async ({ aapClient }, use) => {
    await use(AssessmentBuilder(aapClient))
  },

  sentencePlanBuilder: async ({ aapClient }, use) => {
    await use(SentencePlanBuilder(aapClient))
  },

  coordinatorBuilder: async ({ coordinatorClient }, use) => {
    await use(CoordinatorBuilder(coordinatorClient))
  },

  handoverBuilder: async ({ handoverClient }, use) => {
    await use(HandoverBuilder(handoverClient))
  },

  createSession: async ({ coordinatorBuilder, handoverBuilder }, use) => {
    const createSessionFn = async (options: CreateSessionOptions): Promise<SessionFixture> => {
      const association = await coordinatorBuilder.create().save()

      const sessionBuilder = handoverBuilder.forAssociation(association)

      if (options.accessMode) {
        sessionBuilder.withAccessMode(options.accessMode)
      }

      const session = await sessionBuilder.save()

      const clientId = TARGET_SERVICE_CLIENT_IDS[options.targetService]
      const url = new URL(session.handoverLink)
      url.searchParams.set('clientId', clientId)

      return {
        ...session,
        handoverLink: url.toString(),
      }
    }

    await use(createSessionFn)
  },
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])

    await use(makeAxeBuilder)
  },
})

export { expect } from '@playwright/test'
