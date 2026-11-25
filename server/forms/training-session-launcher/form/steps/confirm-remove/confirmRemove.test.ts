import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness, TestResult } from '@ministryofjustice/hmpps-forge/core/testing'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { mojComponents } from '@ministryofjustice/hmpps-forge/moj-components'
import { trainingSessionLauncherJourney } from '../..'
import { trainingSessionLauncherEffectRegistry } from '../../../effects'
import { TrainingSessionLauncherEffectsDeps } from '../../../effects/types'
import { trainingSessionLauncherComponents } from '../../../components'
import { trainingSessionLauncherTransformerRegistry } from '../../../transformers'
import { removeTrainingStubs } from '../../../effects/sessions/trainingStubs'
import { SavedScenario, Session, TrainingLauncherPreferences } from '../../../types'

// faker is ESM only, which Jest cannot load, and no random values are needed here
jest.mock('@faker-js/faker', () => ({ fakerEN_GB: {}, faker: {} }))
jest.mock('../../../scenarios', () => ({
  ...jest.requireActual('../../../scenarios'),
  generateSeed: () => 1,
  applyRandomization: (values: unknown) => values,
}))
jest.mock('@ministryofjustice/hmpps-azure-telemetry', () => ({ telemetry: { trackEvent: jest.fn() } }))
jest.mock('../../../effects/sessions/trainingStubs')
jest.mock('../../../../../../logger')

const createSession = (id: string, name: string): Session =>
  ({
    id,
    name,
    createdAt: Date.now(),
    targetApplication: 'sentence-plan',
    flags: [],
    values: { crn: `X00000${id.slice(-1)}`, givenName: 'Sam', familyName: 'Smith', gender: '1', location: 'COMMUNITY' },
  }) as unknown as Session

const savedScenario: SavedScenario = {
  id: 'scenario-1',
  name: 'My custom scenario',
  shortDescription: 'Short',
  description: 'Description',
  createdAt: 1,
  updatedAt: 1,
  basedOnPresetId: null,
  flags: [],
  fixedValues: {},
}

describe('confirm-remove step', () => {
  let stored: { trainingLauncher: TrainingLauncherPreferences }
  let update: jest.Mock
  let httpSession: { notifications?: unknown[] }

  const request = (body?: Record<string, unknown>, query?: Record<string, string>) => ({
    body,
    query,
    session: httpSession,
    state: { preferencesId: 'preferences-1', csrfToken: 'csrf-token' },
  })

  const createClient = () => {
    update = jest.fn(async (_id: string, updater: (current: unknown) => typeof stored) => {
      stored = updater(stored)
    })

    const deps = {
      preferencesStore: { get: jest.fn(async () => stored), update },
      wiremockAdminClient: {},
      handoverApiClient: {},
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
  }

  const sessionIds = () => stored.trainingLauncher.sessions.map(s => s.id)

  const expectRedirect = (result: TestResult, url: string) => {
    expect(result).toMatchObject({ type: 'redirect' })
    expect(result.type === 'redirect' && result.url).toMatch(new RegExp(`${url.replace(/[?]/g, '\\?')}$`))
  }

  const renderedQuestion = (result: TestResult) => {
    expect(result.type).toBe('render')
    return result.type === 'render' ? result.context.step.title : undefined
  }

  beforeEach(() => {
    jest.clearAllMocks()
    httpSession = {}
    stored = {
      trainingLauncher: {
        savedScenarios: [savedScenario],
        sessions: [createSession('session-1', 'POM module 8'), createSession('session-2', 'POM module 9')],
      },
    }
  })

  describe('delete session', () => {
    it('should ask for confirmation instead of deleting on the first POST', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/sessions',
        request({ action: 'deleteSession', trainingSessionId: 'session-1' }),
      )

      expectRedirect(result, 'confirm-remove?item=session&id=session-1')
      expect(update).not.toHaveBeenCalled()
      expect(sessionIds()).toEqual(['session-1', 'session-2'])
    })

    it('should name the session in the confirmation question', async () => {
      const client = createClient()

      const result = await client.get(
        '/training-session-launcher/confirm-remove',
        request(undefined, { item: 'session', id: 'session-1' }),
      )

      expect(renderedQuestion(result)).toBe('Are you sure you want to remove POM module 8?')
    })

    it('should delete only that session, once, when confirmed', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/confirm-remove',
        request({ action: 'confirm', trainingSessionId: 'session-1' }, { item: 'session', id: 'session-1' }),
      )

      expectRedirect(result, 'sessions')
      expect(update).toHaveBeenCalledTimes(1)
      expect(sessionIds()).toEqual(['session-2'])
      expect(httpSession.notifications).toEqual([
        { type: 'success', title: 'Session removed', message: 'POM module 8 has been removed.', target: 'sessions' },
      ])
    })

    it('should delete the session named in the query, not one posted in the form body', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/confirm-remove',
        request({ action: 'confirm', trainingSessionId: 'session-2' }, { item: 'session', id: 'session-1' }),
      )

      expectRedirect(result, 'sessions')
      expect(sessionIds()).toEqual(['session-2'])
    })

    it('should leave sessions untouched when cancelled', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/confirm-remove',
        request({ action: 'cancel', trainingSessionId: 'session-1' }, { item: 'session', id: 'session-1' }),
      )

      expectRedirect(result, 'sessions')
      expect(update).not.toHaveBeenCalled()
      expect(sessionIds()).toEqual(['session-1', 'session-2'])
    })

    it('should send the trainer back to Your sessions when the session does not exist', async () => {
      const client = createClient()

      const result = await client.get(
        '/training-session-launcher/confirm-remove',
        request(undefined, { item: 'session', id: 'missing' }),
      )

      expectRedirect(result, 'sessions')
    })
  })

  describe('reset all sessions', () => {
    it('should ask for confirmation instead of resetting on the first POST', async () => {
      const client = createClient()

      const result = await client.post('/training-session-launcher/sessions', request({ action: 'resetAllSessions' }))

      expectRedirect(result, 'confirm-remove?item=all-sessions')
      expect(update).not.toHaveBeenCalled()
      expect(sessionIds()).toHaveLength(2)
    })

    it('should name the number of sessions in the confirmation question', async () => {
      const client = createClient()

      const result = await client.get(
        '/training-session-launcher/confirm-remove',
        request(undefined, { item: 'all-sessions' }),
      )

      expect(renderedQuestion(result)).toBe('Are you sure you want to remove all 2 sessions?')
    })

    it('should remove all sessions, once, when confirmed', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/confirm-remove',
        request({ action: 'confirm' }, { item: 'all-sessions' }),
      )

      expectRedirect(result, 'sessions')
      expect(update).toHaveBeenCalledTimes(1)
      expect(sessionIds()).toEqual([])
      expect(removeTrainingStubs).toHaveBeenCalledTimes(2)
      expect(httpSession.notifications).toEqual([
        {
          type: 'success',
          title: 'Sessions removed',
          message: 'All your training sessions have been removed.',
          target: 'sessions',
        },
      ])
    })

    it('should leave sessions untouched when cancelled', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/confirm-remove',
        request({ action: 'cancel' }, { item: 'all-sessions' }),
      )

      expectRedirect(result, 'sessions')
      expect(update).not.toHaveBeenCalled()
      expect(sessionIds()).toHaveLength(2)
    })
  })

  describe('delete scenario', () => {
    it('should ask for confirmation instead of deleting on the first POST', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/browse',
        request({ action: 'deleteScenario', scenarioId: 'scenario-1' }, { scenario: 'scenario-1' }),
      )

      expectRedirect(result, 'confirm-remove?item=scenario&id=scenario-1')
      expect(update).not.toHaveBeenCalled()
    })

    it('should name the scenario in the confirmation question', async () => {
      const client = createClient()

      const result = await client.get(
        '/training-session-launcher/confirm-remove',
        request(undefined, { item: 'scenario', id: 'scenario-1' }),
      )

      expect(renderedQuestion(result)).toBe('Are you sure you want to remove My custom scenario?')
    })

    it('should delete the scenario, once, and return to browse when confirmed', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/confirm-remove',
        request({ action: 'confirm', scenarioId: 'scenario-1' }, { item: 'scenario', id: 'scenario-1' }),
      )

      expectRedirect(result, 'browse')
      expect(update).toHaveBeenCalledTimes(1)
      expect(stored.trainingLauncher.savedScenarios).toEqual([])
    })

    it('should keep the scenario and return to it when cancelled', async () => {
      const client = createClient()

      const result = await client.post(
        '/training-session-launcher/confirm-remove',
        request({ action: 'cancel', scenarioId: 'scenario-1' }, { item: 'scenario', id: 'scenario-1' }),
      )

      expectRedirect(result, 'browse?scenario=scenario-1')
      expect(update).not.toHaveBeenCalled()
      expect(stored.trainingLauncher.savedScenarios).toHaveLength(1)
    })
  })
})
