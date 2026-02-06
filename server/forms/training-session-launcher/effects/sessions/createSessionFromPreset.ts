import crypto from 'node:crypto'
import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { getExcludedFields } from '../../flags/handlers'
import { applyRandomization, getPresetById, getRandomizeFields, resolvePreset } from '../../scenarios'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences, Session } from '../../types'
import { TrainingSessionLauncherEffectsDeps, TrainingLauncherNotification } from '../types'
import { createInCoordinatorAndUpdatePreferences } from './coordinatorHelpers'

/**
 * Default empty preferences
 */
const DEFAULT_PREFERENCES: TrainingLauncherPreferences = {
  savedScenarios: [],
  sessions: [],
}

/**
 * Create a training session from a preset scenario (browse page quick start).
 *
 * This effect:
 * 1. Reads scenarioId and seed from POST data
 * 2. Finds the preset/saved scenario by ID
 * 3. Resolves it with the SAME seed to get the SAME values user saw
 * 4. Saves the Session to preferences
 * 5. Calls coordinator API to create the OASys association
 * 6. Updates the session with response IDs
 *
 * The seed is passed through the form to ensure reproducible randomization -
 * the user gets exactly the values they saw on screen.
 */
export const createSessionFromPreset =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot create session: preferencesId is missing from state')
    }

    const scenarioId = context.getPostData('scenarioId') as string | undefined
    const seedStr = context.getPostData('seed') as string | undefined
    const seed = seedStr ? parseInt(seedStr, 10) : undefined

    if (!scenarioId) {
      throw new Error('Cannot create session: scenarioId is missing from POST data')
    }

    if (!seed) {
      throw new Error('Cannot create session: seed is missing from POST data')
    }

    // First try built-in presets
    const preset = getPresetById(scenarioId)

    if (preset) {
      const excludedFields = getExcludedFields(preset.flags)
      const resolved = resolvePreset(preset, seed, excludedFields)

      const session: Session = {
        id: crypto.randomUUID(),
        name: resolved.name,
        createdAt: Date.now(),
        targetApplication: 'sentence-plan',
        flags: resolved.flags,
        values: resolved.values,
      }

      return saveSessionAndCreateInBackend(deps, context, session, preferencesId)
    }

    // Try saved scenarios from preferences
    const preferences = await deps.preferencesStore.get<{ trainingLauncher?: TrainingLauncherPreferences }>(
      preferencesId,
    )
    const trainingLauncher = preferences?.trainingLauncher ?? DEFAULT_PREFERENCES
    const savedScenario = trainingLauncher.savedScenarios.find(s => s.id === scenarioId)

    if (savedScenario) {
      const excludedFields = getExcludedFields(savedScenario.flags)
      const randomizeFields = getRandomizeFields(savedScenario.fixedValues, excludedFields)
      const values = applyRandomization(savedScenario.fixedValues, randomizeFields, seed)

      const session: Session = {
        id: crypto.randomUUID(),
        name: savedScenario.name,
        createdAt: Date.now(),
        targetApplication: 'sentence-plan',
        flags: savedScenario.flags,
        values,
      }

      return saveSessionAndCreateInBackend(deps, context, session, preferencesId)
    }

    throw new Error(`Cannot create session: scenario with ID '${scenarioId}' not found`)
  }

/**
 * Save session to preferences and create in coordinator API
 */
async function saveSessionAndCreateInBackend(
  deps: TrainingSessionLauncherEffectsDeps,
  context: TrainingSessionLauncherContext,
  session: Session,
  preferencesId: string,
): Promise<void> {
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

  telemetry.trackEvent('TrainingSessionCreated', {
    sessionId: session.id,
    sessionName: session.name,
    source: 'preset',
  })

  // Add success notification
  const userSession = context.getSession()
  userSession.notifications = userSession.notifications || []

  const notification: TrainingLauncherNotification = {
    type: 'success',
    title: 'Session created',
    message: `'${session.name}' session is ready. Generate a handover link to begin.`,
    target: 'sessions',
  }
  userSession.notifications.push(notification)
}
