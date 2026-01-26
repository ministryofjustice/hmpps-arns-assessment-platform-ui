import { InternalServerError } from 'http-errors'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences, SavedScenario } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'

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
 */
export const deleteScenario =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext, scenarioId: string) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw InternalServerError('Missing preferencesId in req.state')
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
  }
