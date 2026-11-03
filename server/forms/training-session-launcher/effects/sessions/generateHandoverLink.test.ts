import { generateHandoverLink } from './generateHandoverLink'
import { PartialScenarioValues } from '../../scenarios/schema'
import { Session, TrainingSessionLauncherContext } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'
import { registerTrainingStubs } from './trainingStubs'
import type { HandoverApiClient, PreferencesStore, WiremockAdminClient } from '../../../../data'

jest.mock('../../../../config', () => ({
  handoverTargets: {
    'sentence-plan': { clientId: 'sentence-plan' },
    'strengths-and-needs': { clientId: 'strengths-and-needs' },
    'tiering-assessment': { clientId: 'tiering-assessment' },
  },
  ingressUrl: 'http://localhost:3000',
}))

jest.mock('./trainingStubs')

// flags/handlers pulls in faker (ESM only), which Jest cannot load, and none of its behaviour is under test here
jest.mock('../../flags/handlers', () => ({
  resolveHandoverConfig: () => ({ urlParams: {}, modifyRequest: (request: unknown) => request }),
}))

const createSession = (values: PartialScenarioValues, flags: Session['flags'] = []): Session => ({
  id: 'session-1',
  name: 'Session',
  createdAt: 1,
  targetApplication: 'sentence-plan',
  flags,
  values: values as Session['values'],
})

describe('generateHandoverLink', () => {
  let handoverApiClient: jest.Mocked<Pick<HandoverApiClient, 'createHandoverLink'>>
  let wiremockAdminClient: jest.Mocked<Pick<WiremockAdminClient, 'canStub' | 'importStubs'>>
  let preferencesStore: jest.Mocked<Pick<PreferencesStore, 'get'>>
  let deps: TrainingSessionLauncherEffectsDeps
  let context: TrainingSessionLauncherContext

  const givenSession = (session: Session) => {
    preferencesStore.get.mockResolvedValue({ trainingLauncher: { savedScenarios: [], sessions: [session] } })
  }

  beforeEach(() => {
    handoverApiClient = { createHandoverLink: jest.fn().mockResolvedValue({ handoverLink: 'http://handover/link' }) }
    wiremockAdminClient = { canStub: jest.fn().mockReturnValue(true), importStubs: jest.fn() }
    preferencesStore = { get: jest.fn() }
    deps = {
      handoverApiClient,
      wiremockAdminClient,
      preferencesStore,
      coordinatorApiClient: {},
    } as unknown as TrainingSessionLauncherEffectsDeps
    context = {
      getState: jest.fn().mockReturnValue('preferences-1'),
      getPostData: jest.fn((key: string) => (key === 'trainingSessionId' ? 'session-1' : undefined)),
      setData: jest.fn(),
    } as unknown as TrainingSessionLauncherContext
  })

  it('should register the training stubs for the session before creating the handover link', async () => {
    // Arrange
    const session = createSession({ crn: 'X123456', useMockedCriminogenicNeeds: 'YES', accOtherWeightedScore: '4' }, [
      'SAN_PRIVATE_BETA',
    ])
    givenSession(session)

    await generateHandoverLink(deps)(context)

    expect(registerTrainingStubs).toHaveBeenCalledWith(wiremockAdminClient, session.values, session.flags)
    expect(jest.mocked(registerTrainingStubs).mock.invocationCallOrder[0]).toBeLessThan(
      handoverApiClient.createHandoverLink.mock.invocationCallOrder[0],
    )
  })

  it('should not send criminogenic needs in the handover request, even for SAN Private Beta', async () => {
    // Arrange
    givenSession(
      createSession({ crn: 'X123456', useMockedCriminogenicNeeds: 'YES', accLinkedToHarm: 'YES' }, [
        'SAN_PRIVATE_BETA',
      ]),
    )

    // Act
    await generateHandoverLink(deps)(context)

    // Assert
    const [request] = handoverApiClient.createHandoverLink.mock.calls[0]
    expect(request).not.toHaveProperty('criminogenicNeedsData')
  })
})
