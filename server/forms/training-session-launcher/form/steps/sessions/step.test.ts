import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { mojComponents } from '@ministryofjustice/hmpps-forge/moj-components'
import { trainingSessionLauncherJourney } from '../..'
import { trainingSessionLauncherEffectRegistry } from '../../../effects'
import { TrainingSessionLauncherEffectsDeps } from '../../../effects/types'
import { trainingSessionLauncherComponents } from '../../../components'
import { trainingSessionLauncherTransformerRegistry } from '../../../transformers'
import { Session } from '../../../types'

// faker is ESM only, which Jest cannot load, and no random values are needed here
jest.mock('@faker-js/faker', () => ({ fakerEN_GB: {}, faker: {} }))
jest.mock('@ministryofjustice/hmpps-azure-telemetry', () => ({ telemetry: { trackEvent: jest.fn() } }))
jest.mock('../../../effects/sessions/trainingStubs')
jest.mock('../../../../../../logger')

const session = {
  id: 'session-1',
  name: 'POM module 8',
  createdAt: Date.now(),
  targetApplication: 'sentence-plan',
  flags: [],
  values: { crn: 'X000001', givenName: 'Sam', familyName: 'Smith', gender: '1', location: 'COMMUNITY' },
} as unknown as Session

describe('sessions step: generate link', () => {
  const createHandoverLink = jest.fn()

  const generateLink = () => {
    const deps = {
      preferencesStore: {
        get: jest.fn(async () => ({ trainingLauncher: { savedScenarios: [] as unknown[], sessions: [session] } })),
      },
      handoverApiClient: { createHandoverLink },
      wiremockAdminClient: {},
      coordinatorApiClient: {},
    } as unknown as TrainingSessionLauncherEffectsDeps

    return new ForgeTestHarness()
      .registerGlobalComponents(govukComponents)
      .registerGlobalComponents(mojComponents)
      .registerPackage(
        createForgePackage<TrainingSessionLauncherEffectsDeps>({
          journey: trainingSessionLauncherJourney,
          components: trainingSessionLauncherComponents,
          functions: [trainingSessionLauncherEffectRegistry, trainingSessionLauncherTransformerRegistry],
        }),
        deps,
      )
      .createClient()
      .post('/training-session-launcher/sessions', {
        body: { action: 'generateLink', trainingSessionId: 'session-1', targetApplication: 'sentence-plan' },
        session: {},
        state: { preferencesId: 'preferences-1', csrfToken: 'csrf-token' },
      })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to the handover link when it is created', async () => {
    createHandoverLink.mockResolvedValue({ handoverLink: 'http://handover/link' })

    const result = await generateLink()

    expect(result).toMatchObject({ type: 'redirect', url: 'http://handover/link?clientId=sentence-plan' })
  })

  it('should stay on Your sessions with an error summary when the handover API fails', async () => {
    createHandoverLink.mockRejectedValue(new Error('Handover API unavailable'))

    const result = await generateLink()

    expect(result.type).toBe('render')
    const html = result.type === 'render' ? JSON.stringify(result.context.blocks) : ''
    expect(html).toContain('govuk-error-summary')
    expect(html).toContain('The link could not be created. Try again. If it keeps happening, tell the training team.')
  })
})
