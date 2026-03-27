import { AxeBuilder } from '@axe-core/playwright'
import { test as base } from '@playwright/test'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { promises as fs } from 'node:fs'
import type { AccessMode, CriminogenicNeedsData } from '@server/interfaces/handover-api/shared'
import type { AssessmentType } from '@server/interfaces/coordinator-api/oasysCreate'
import { login } from 'testUtils'
import PrivacyScreenPage from 'pages/sentencePlan/privacyScreenPage'
import { sentencePlanV1URLs } from 'specs/sentencePlan/sentencePlanUtils'
import MpopPage from 'pages/sentencePlan/mpopPage'
import type { PlaywrightExtendedConfig } from '../../playwright.config'
import { TestHmppsAuthClient } from './apis/TestHmppsAuthClient'
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
import { AuditQueueClient } from './AuditQueueClient'
import { captureContainerLogs } from './DockerLogCapture'

/**
 * Default criminogenic needs data for E2E tests.
 * Provides linked indicators and scores for all areas so tests work by default.
 * Tests can override specific areas as needed.
 */
const defaultCriminogenicNeedsData: CriminogenicNeedsData = {
  accommodation: {
    accLinkedToHarm: 'YES',
    accLinkedToReoffending: 'YES',
    accStrengths: 'YES',
    accOtherWeightedScore: '6',
  },
  educationTrainingEmployability: {
    eteLinkedToHarm: 'YES',
    eteLinkedToReoffending: 'YES',
    eteStrengths: 'YES',
    eteOtherWeightedScore: '4',
  },
  finance: {
    financeLinkedToHarm: 'YES',
    financeLinkedToReoffending: 'YES',
    financeStrengths: 'YES',
  },
  drugMisuse: {
    drugLinkedToHarm: 'YES',
    drugLinkedToReoffending: 'YES',
    drugStrengths: 'YES',
    drugOtherWeightedScore: '6',
  },
  alcoholMisuse: {
    alcoholLinkedToHarm: 'YES',
    alcoholLinkedToReoffending: 'YES',
    alcoholStrengths: 'YES',
    alcoholOtherWeightedScore: '4',
  },
  healthAndWellbeing: {
    emoLinkedToHarm: 'YES',
    emoLinkedToReoffending: 'YES',
    emoStrengths: 'YES',
  },
  personalRelationshipsAndCommunity: {
    relLinkedToHarm: 'YES',
    relLinkedToReoffending: 'YES',
    relStrengths: 'YES',
    relOtherWeightedScore: '6',
  },
  thinkingBehaviourAndAttitudes: {
    thinkLinkedToHarm: 'YES',
    thinkLinkedToReoffending: 'YES',
    thinkStrengths: 'YES',
    thinkOtherWeightedScore: '8',
  },
  lifestyleAndAssociates: {
    lifestyleLinkedToHarm: 'YES',
    lifestyleLinkedToReoffending: 'YES',
    lifestyleStrengths: 'YES',
    lifestyleOtherWeightedScore: '4',
  },
}

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
  planAccessMode?: AccessMode
  assessmentType?: AssessmentType
  pnc?: string
  /**
   * Criminogenic needs data from OASys (via handover).
   * Provides linked indicators (YES/NO) and scores for assessment areas.
   * Defaults to all areas having YES for all indicators with typical scores.
   * Pass specific overrides or `null` to test missing data scenarios.
   */
  criminogenicNeedsData?: CriminogenicNeedsData | null
  /**
   * Plan version to include in the handover request.
   * When set, indicates the user is accessing a previous version of the plan.
   */
  planVersion?: number
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
 * Worker-scoped fixtures shared across all tests in a worker.
 * The auth client is worker-scoped so a single token is cached and reused
 * instead of requesting a new one from HMPPS Auth for every test.
 */
type WorkerFixtures = {
  apis: PlaywrightExtendedConfig['apis']
  authClient: TestHmppsAuthClient
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
  auditQueue: AuditQueueClient
  makeAxeBuilder: () => AxeBuilder
  mpopUser: MpopPage
}

type InternalFixtures = {
  captureDockerLogsOnFailure: void
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
export const test = base.extend<TestApiFixtures & InternalFixtures, WorkerFixtures>({
  apis: [undefined as unknown as PlaywrightExtendedConfig['apis'], { option: true, scope: 'worker' }],

  authClient: [
    async ({ apis }, use) => {
      const authClient = new TestHmppsAuthClient({
        url: apis.hmppsAuth.url,
        systemClientId: apis.hmppsAuth.systemClientId,
        systemClientSecret: apis.hmppsAuth.systemClientSecret,
      })

      await use(authClient)
    },
    { scope: 'worker' },
  ],

  aapClient: async ({ authClient, apis }, use, testInfo) => {
    const client = new TestAapApiClient({
      baseUrl: apis.aapApi.url,
      dbConnectionString: apis.aapApi.dbConnectionString,
      authenticationClient: authClient as unknown as AuthenticationClient,
      testInfo,
    })

    await use(client)
  },

  handoverClient: async ({ authClient, apis }, use, testInfo) => {
    const client = new TestHandoverApiClient({
      baseUrl: apis.handoverApi.url,
      authenticationClient: authClient as unknown as AuthenticationClient,
      testInfo,
    })

    await use(client)
  },

  coordinatorClient: async ({ authClient, apis }, use, testInfo) => {
    const client = new TestCoordinatorApiClient({
      baseUrl: apis.coordinatorApi.url,
      authenticationClient: authClient as unknown as AuthenticationClient,
      testInfo,
    })

    await use(client)
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
      const builder = coordinatorBuilder.create()

      if (options.assessmentType) {
        builder.withAssessmentType(options.assessmentType)
      }

      const association = await builder.save()

      const sessionBuilder = handoverBuilder.forAssociation(association)

      if (options.pnc) {
        sessionBuilder.withSubjectPNC(options.pnc)
      }

      if (options.planAccessMode) {
        sessionBuilder.withPlanAccessMode(options.planAccessMode)
      }

      // Handle criminogenic needs data:
      // - If explicitly null, don't set any data (for testing missing data scenarios)
      // - If provided, use the provided data
      // - Otherwise use defaults so tests work without explicit setup
      if (options.criminogenicNeedsData !== null) {
        const criminogenicNeeds = options.criminogenicNeedsData ?? defaultCriminogenicNeedsData
        sessionBuilder.withCriminogenicNeeds(criminogenicNeeds)
      }

      if (options.planVersion) {
        sessionBuilder.withPlanVersion(options.planVersion)
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
  auditQueue: async ({ apis }, use) => {
    const client = AuditQueueClient.getInstance({
      queueUrl: apis.localstack.queueUrl,
      region: apis.localstack.region,
      endpoint: apis.localstack.url,
    })
    await use(client)
  },

  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])

    await use(makeAxeBuilder)
  },

  mpopUser: async ({ page, createSession, sentencePlanBuilder }, use) => {
    const { sentencePlanId, crn } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).withAgreementStatus('AGREED').save()
    try {
      await fs.stat('.auth/mpop.json')
      await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
      const heading = await page.$$(
        "text='Remember to close any other applications before starting an appointment with Buster'",
      )

      if (heading.length > 0) {
        const privacyPage = await PrivacyScreenPage.verifyOnPage(page)
        await privacyPage.confirmAndContinue()
      }
      const mpopPage = new MpopPage(page, crn)
      await use(mpopPage)
    } catch {
      await login(page)
      await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
      const privacyPage = await PrivacyScreenPage.verifyOnPage(page)
      await privacyPage.confirmAndContinue()
      const mpopPage = new MpopPage(page, crn)
      await use(mpopPage)
    }
  },

  captureDockerLogsOnFailure: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      const startedAt = new Date()

      await use()

      if (testInfo.status === testInfo.expectedStatus) {
        return
      }

      const ui = await captureContainerLogs('ui', { since: startedAt })
      const logsPath = testInfo.outputPath('ui-container-logs.txt')

      await fs.writeFile(logsPath, ui.logs, 'utf-8')

      await testInfo.attach('ui-container-logs', {
        path: logsPath,
        contentType: 'text/plain',
      })

      const auth = await captureContainerLogs('hmpps-auth', { since: startedAt })
      const authLogsPath = testInfo.outputPath('ui-container-logs.txt')

      await fs.writeFile(authLogsPath, auth.logs, 'utf-8')

      await testInfo.attach('hmpps-auth-container-logs', {
        path: authLogsPath,
        contentType: 'text/plain',
      })
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'
