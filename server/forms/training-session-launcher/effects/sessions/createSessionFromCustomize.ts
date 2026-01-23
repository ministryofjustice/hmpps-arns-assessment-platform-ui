import crypto from 'node:crypto'
import { TrainingScenarioFlag } from '../../constants'
import { scenarioFieldKeys, scenarioFieldSchema, ScenarioValues } from '../../scenarioSchema'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences, Session } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'
import { createInCoordinatorAndUpdatePreferences } from './coordinatorHelpers'

/**
 * Default empty preferences
 */
const DEFAULT_PREFERENCES: TrainingLauncherPreferences = {
  savedScenarios: [],
  sessions: [],
}

/**
 * Collect all field values from form submission.
 *
 * For fields marked as randomized, generates a fresh random value using the
 * schema's randomizer. For other fields, uses the submitted form value.
 */
function collectSessionData(context: TrainingSessionLauncherContext): {
  scenarioName: string
  values: ScenarioValues
  flags: TrainingScenarioFlag[]
} {
  const scenarioName = context.getAnswer('scenarioName') || 'Untitled Session'
  const flags = context.getAnswer('flags') ?? []

  const values: Partial<ScenarioValues> = {}

  for (const fieldKey of scenarioFieldKeys) {
    const shouldRandomize = context.getPostData(`${fieldKey}_randomize`) === 'true'

    if (shouldRandomize) {
      ;(values as Record<string, unknown>)[fieldKey] = scenarioFieldSchema[fieldKey].randomize()
    } else {
      const value = context.getAnswer(fieldKey)

      if (value !== undefined) {
        ;(values as Record<string, unknown>)[fieldKey] = value
      }
    }
  }

  return {
    scenarioName,
    values: values as ScenarioValues,
    flags,
  }
}

/**
 * Create a training session from the customised scenario.
 *
 * This effect:
 * 1. Collects field values - using form values for fixed fields, generating
 *    fresh random values for fields marked as randomized
 * 2. Saves the Session to preferences
 * 3. Calls coordinator API to create the OASys association
 * 4. Updates the session with response IDs
 */
export const createSessionFromCustomize =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot create session: preferencesId is missing from state')
    }

    const { scenarioName, values, flags } = collectSessionData(context)

    const session: Session = {
      id: crypto.randomUUID(),
      name: scenarioName,
      createdAt: Date.now(),
      targetApplication: 'sentence-plan',
      flags,
      values,
    }

    // Save session to preferences
    await deps.preferencesStore.update<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId, current => {
      const trainingLauncher = current?.trainingLauncher ?? DEFAULT_PREFERENCES

      return {
        ...current,
        trainingLauncher: {
          ...trainingLauncher,
          sessions: [...trainingLauncher.sessions, session],
        },
      }
    })

    // Create in coordinator API and update preferences with response
    await createInCoordinatorAndUpdatePreferences(deps, context, session, preferencesId)

    // Store the session ID for use by subsequent effects or redirects
    context.setData('generatedSessionId', session.id)
  }
