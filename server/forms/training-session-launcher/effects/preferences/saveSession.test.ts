import { deleteAllSessions, deleteSession } from './saveSession'
import { removeTrainingStubs } from '../sessions/trainingStubs'
import { Session, TrainingLauncherPreferences, TrainingSessionLauncherContext } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'
import type { PreferencesStore } from '../../../../data'

jest.mock('../sessions/trainingStubs')

const session = (id: string, crn: string): Session => ({
  id,
  name: id,
  createdAt: 1,
  targetApplication: 'sentence-plan',
  flags: [],
  values: { crn } as Session['values'],
})

describe('saveSession', () => {
  let preferencesStore: jest.Mocked<Pick<PreferencesStore, 'get' | 'update'>>
  let deps: TrainingSessionLauncherEffectsDeps
  let context: TrainingSessionLauncherContext

  const givenSessions = (...sessions: Session[]) => {
    const preferences: { trainingLauncher: TrainingLauncherPreferences } = {
      trainingLauncher: { savedScenarios: [], sessions },
    }

    preferencesStore.get.mockResolvedValue(preferences)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    preferencesStore = { get: jest.fn(), update: jest.fn() }
    deps = { preferencesStore, wiremockAdminClient: {} } as unknown as TrainingSessionLauncherEffectsDeps
    context = {
      getState: jest.fn().mockReturnValue('preferences-1'),
      getPostData: jest.fn().mockReturnValue('session-1'),
    } as unknown as TrainingSessionLauncherContext
  })

  describe('deleteSession()', () => {
    it("should remove the deleted session's stubs after deleting it", async () => {
      givenSessions(session('session-1', 'A123456'), session('session-2', 'B123456'))

      await deleteSession(deps)(context)

      expect(removeTrainingStubs).toHaveBeenCalledWith(deps.wiremockAdminClient, 'A123456')
      expect(removeTrainingStubs).toHaveBeenCalledTimes(1)
      expect(jest.mocked(removeTrainingStubs).mock.invocationCallOrder[0]).toBeGreaterThan(
        preferencesStore.update.mock.invocationCallOrder[0],
      )
    })

    it('should keep the stubs when another of the sessions uses the same CRN', async () => {
      givenSessions(session('session-1', 'A123456'), session('session-2', 'A123456'))

      await deleteSession(deps)(context)

      expect(preferencesStore.update).toHaveBeenCalledTimes(1)
      expect(removeTrainingStubs).not.toHaveBeenCalled()
    })

    it('should not remove any stubs when the session is not found', async () => {
      givenSessions(session('session-2', 'B123456'))

      await deleteSession(deps)(context)

      expect(removeTrainingStubs).not.toHaveBeenCalled()
    })
  })

  describe('deleteAllSessions()', () => {
    it('should remove the stubs for each CRN once', async () => {
      givenSessions(session('session-1', 'A123456'), session('session-2', 'B123456'), session('session-3', 'A123456'))

      await deleteAllSessions(deps)(context)

      expect(removeTrainingStubs).toHaveBeenCalledTimes(2)
      expect(removeTrainingStubs).toHaveBeenCalledWith(deps.wiremockAdminClient, 'A123456')
      expect(removeTrainingStubs).toHaveBeenCalledWith(deps.wiremockAdminClient, 'B123456')
    })
  })
})
