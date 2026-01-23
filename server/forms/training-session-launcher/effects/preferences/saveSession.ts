import { TrainingSessionLauncherContext, TrainingLauncherPreferences, Session } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'

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

/**
 * Delete a session from user preferences.
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
  }

/**
 * Delete all sessions from user preferences.
 */
export const deleteAllSessions =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot delete sessions: preferencesId is missing from state')
    }

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
  }
