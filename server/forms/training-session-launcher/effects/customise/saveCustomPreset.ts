import crypto from 'node:crypto'
import { TrainingScenarioFlag } from '../../constants'
import { scenarioFieldKeys, ScenarioValues } from '../../scenarios'
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
 * Collect customisation data from form submission.
 * Fields marked as randomized are excluded from fixedValues.
 */
function collectCustomisationData(context: TrainingSessionLauncherContext): {
  scenarioName: string
  scenarioId: string
  flags: TrainingScenarioFlag[]
  fixedValues: Partial<ScenarioValues>
} {
  const scenarioName = context.getAnswer('scenarioName') || 'Untitled Scenario'
  const scenarioId = context.getPostData('scenarioId') as string | undefined
  const flags = context.getAnswer('flags') ?? []

  const fixedValues: Partial<ScenarioValues> = {}

  for (const fieldKey of scenarioFieldKeys) {
    const randomizeFlag = context.getPostData(`${fieldKey}_randomize`)
    const shouldRandomize = randomizeFlag === 'true'

    if (!shouldRandomize) {
      const value = context.getAnswer(fieldKey)

      if (value !== undefined) {
        ;(fixedValues as Record<string, unknown>)[fieldKey] = value
      }
    }
  }

  return {
    scenarioName,
    scenarioId: scenarioId || 'custom',
    flags,
    fixedValues,
  }
}

/**
 * Save the customised scenario as a preset to user preferences.
 *
 * Collects field values and randomize flags from the form submission,
 * then saves as a new SavedScenario in Redis.
 */
export const saveCustomPreset =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot save custom preset: preferencesId is missing from state')
    }

    const { scenarioName, scenarioId, flags, fixedValues } = collectCustomisationData(context)

    const now = Date.now()
    const savedScenario: SavedScenario = {
      id: crypto.randomUUID(),
      name: scenarioName,
      shortDescription: 'Custom scenario',
      description: `Custom scenario based on ${scenarioId}`,
      createdAt: now,
      updatedAt: now,
      basedOnPresetId: scenarioId,
      flags,
      fixedValues,
    }

    await deps.preferencesStore.update<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId, current => {
      const trainingLauncher = current?.trainingLauncher ?? DEFAULT_PREFERENCES

      return {
        ...current,
        trainingLauncher: {
          ...trainingLauncher,
          savedScenarios: [...trainingLauncher.savedScenarios, savedScenario],
        },
      }
    })

    // Add success notification
    const session = context.getSession()
    session.notifications = session.notifications || []

    const notification: TrainingLauncherNotification = {
      type: 'success',
      title: 'Scenario saved',
      message: `'${scenarioName}' has been saved to your scenarios.`,
      target: 'browse',
    }
    session.notifications.push(notification)
  }
