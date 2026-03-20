import { InternalServerError } from 'http-errors'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences, SavedScenario } from '../../types'
import { TrainingSessionLauncherEffectsDeps, TrainingLauncherNotification } from '../types'

/**
 * Default empty preferences
 */
const DEFAULT_PREFERENCES: TrainingLauncherPreferences = {
  savedScenarios: [],
  sessions: [],
}

/**
 * Save a scenario to user preferences.
 *
 * If a scenario with the same ID already exists, it will be updated.
 * Otherwise, a new scenario will be added.
 */
export const saveScenario =
  (deps: TrainingSessionLauncherEffectsDeps) =>
  async (context: TrainingSessionLauncherContext, scenario: SavedScenario) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw InternalServerError('Missing preferencesId in req.state')
    }

    await deps.preferencesStore.update<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId, current => {
      const trainingLauncher = current?.trainingLauncher ?? DEFAULT_PREFERENCES
      const existingIndex = trainingLauncher.savedScenarios.findIndex(s => s.id === scenario.id)

      const updatedScenarios =
        existingIndex >= 0
          ? trainingLauncher.savedScenarios.map((s, i) => (i === existingIndex ? scenario : s))
          : [...trainingLauncher.savedScenarios, scenario]

      return {
        ...current,
        trainingLauncher: {
          ...trainingLauncher,
          savedScenarios: updatedScenarios,
        },
      }
    })
  }

/**
 * Delete a saved scenario from user preferences.
 *
 * Reads the scenario ID from POST data (scenarioId field).
 */
export const deleteScenario =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')
    const scenarioId = context.getPostData('scenarioId') as string | undefined

    if (!preferencesId) {
      throw InternalServerError('Missing preferencesId in req.state')
    }

    if (!scenarioId) {
      throw InternalServerError('Missing scenarioId in POST data')
    }

    await deps.preferencesStore.update<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId, current => {
      const trainingLauncher = current?.trainingLauncher ?? DEFAULT_PREFERENCES

      return {
        ...current,
        trainingLauncher: {
          ...trainingLauncher,
          savedScenarios: trainingLauncher.savedScenarios.filter(s => s.id !== scenarioId),
        },
      }
    })

    // Add success notification
    const session = context.getSession()
    session.notifications = session.notifications || []

    const notification: TrainingLauncherNotification = {
      type: 'success',
      title: 'Scenario deleted',
      message: 'The custom scenario has been deleted.',
      target: 'browse',
    }
    session.notifications.push(notification)
  }
