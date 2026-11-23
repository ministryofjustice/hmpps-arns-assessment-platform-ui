import { createSessionFromCustomize } from './createSessionFromCustomize'
import { createInCoordinatorAndUpdatePreferences } from './coordinatorHelpers'
import { Session, TrainingSessionLauncherContext } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'

jest.mock('@ministryofjustice/hmpps-azure-telemetry', () => ({
  telemetry: { trackEvent: jest.fn() },
}))
jest.mock('./coordinatorHelpers', () => ({ createInCoordinatorAndUpdatePreferences: jest.fn() }))
// The scenarios module pulls in faker (ESM only), which Jest cannot load
jest.mock('../../scenarios', () => ({
  scenarioFieldKeys: ['crn'],
  scenarioFieldSchema: { crn: { randomize: () => 'R000000' } },
}))

describe('createSessionFromCustomize', () => {
  const userSession: { notifications?: unknown[] } = {}
  let deps: TrainingSessionLauncherEffectsDeps
  let context: TrainingSessionLauncherContext

  const givenAnswers = (answers: Record<string, unknown>) => {
    context = {
      getState: jest.fn().mockReturnValue('preferences-1'),
      getAnswer: jest.fn((code: string) => answers[code]),
      getPostData: jest.fn().mockReturnValue(undefined),
      setData: jest.fn(),
      getSession: jest.fn().mockReturnValue(userSession),
    } as unknown as TrainingSessionLauncherContext
  }

  beforeEach(() => {
    jest.clearAllMocks()
    userSession.notifications = []
    deps = { preferencesStore: { update: jest.fn() } } as unknown as TrainingSessionLauncherEffectsDeps
  })

  it('should name the session with the submitted scenario name', async () => {
    givenAnswers({ scenarioName: 'Housing crisis (Customised)', crn: 'X123456' })

    await createSessionFromCustomize(deps)(context)

    const session = jest.mocked(createInCoordinatorAndUpdatePreferences).mock.calls[0][2] as Session
    expect(session.name).toBe('Housing crisis (Customised)')
    expect(session.values.crn).toBe('X123456')
  })

  it('should tell the user how to open the session without mentioning a handover link', async () => {
    givenAnswers({ scenarioName: 'Housing crisis' })

    await createSessionFromCustomize(deps)(context)

    expect(userSession.notifications).toEqual([
      expect.objectContaining({
        type: 'success',
        message: 'Housing crisis session started. Select Generate link to open it.',
        target: 'sessions',
      }),
    ])
  })
})
