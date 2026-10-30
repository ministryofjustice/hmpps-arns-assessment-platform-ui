import { TrainingSessionLauncherContext, TrainingLauncherPreferences, Session } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'
import { removeTrainingStubs } from '../sessions/trainingStubs'

/**
 * Default empty preferences
 */
const DEFAULT_PREFERENCES: TrainingLauncherPreferences = {
  savedScenarios: [],
  sessions: [],
}

/**
 * Save a session to user preferences.
 *
 * If a session with the same ID already exists, it will be updated.
 * Otherwise, a new session will be added.
 */
export const saveSession =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext, session: Session) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot save session: preferencesId is missing from state')
    }

    await deps.preferencesStore.update<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId, current => {
      const trainingLauncher = current?.trainingLauncher ?? DEFAULT_PREFERENCES
      const existingIndex = trainingLauncher.sessions.findIndex(s => s.id === session.id)

      const updatedSessions =
        existingIndex >= 0
          ? trainingLauncher.sessions.map((s, i) => (i === existingIndex ? session : s))
          : [...trainingLauncher.sessions, session]

      return {
        ...current,
        trainingLauncher: {
          ...trainingLauncher,
          sessions: updatedSessions,
        },
      }
    })
  }

async function loadSessions(deps: TrainingSessionLauncherEffectsDeps, preferencesId: string): Promise<Session[]> {
  const preferences = await deps.preferencesStore.get<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId)

  return preferences?.trainingLauncher?.sessions ?? []
}

/**
 * Delete a session from user preferences, and its Wiremock stubs unless another of the user's sessions uses
 * the same CRN.
 *
 * Reads the session ID from POST data (trainingSessionId field).
 */
export const deleteSession =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')
    const sessionId = context.getPostData('trainingSessionId') as string | undefined

    if (!preferencesId) {
      throw new Error('Cannot delete session: preferencesId is missing from state')
    }

    if (!sessionId) {
      throw new Error('Cannot delete session: trainingSessionId is missing from POST data')
    }

    const sessions = await loadSessions(deps, preferencesId)
    const deletedCrn = sessions.find(s => s.id === sessionId)?.values.crn
    const isCrnStillUsed = sessions.some(s => s.id !== sessionId && s.values.crn === deletedCrn)

    await deps.preferencesStore.update<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId, current => {
      const trainingLauncher = current?.trainingLauncher ?? DEFAULT_PREFERENCES

      return {
        ...current,
        trainingLauncher: {
          ...trainingLauncher,
          sessions: trainingLauncher.sessions.filter(s => s.id !== sessionId),
        },
      }
    })

    if (deletedCrn && !isCrnStillUsed) {
      await removeTrainingStubs(deps.wiremockAdminClient, deletedCrn)
    }
  }

/**
 * Delete all sessions from user preferences, and their Wiremock stubs.
 */
export const deleteAllSessions =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot delete sessions: preferencesId is missing from state')
    }

    const crns = new Set((await loadSessions(deps, preferencesId)).map(s => s.values.crn))

    await deps.preferencesStore.update<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId, current => {
      const trainingLauncher = current?.trainingLauncher ?? DEFAULT_PREFERENCES

      return {
        ...current,
        trainingLauncher: {
          ...trainingLauncher,
          sessions: [],
        },
      }
    })

    await Promise.all([...crns].map(crn => removeTrainingStubs(deps.wiremockAdminClient, crn)))
  }
