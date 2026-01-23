import {
  getPresetById,
  getRandomizeFields,
  resolvePreset,
  scenarioPresets,
  TrainingScenarioFlag,
} from '../../constants'
import { getExcludedFields } from '../../flags/handlers'
import {
  ScenarioFieldKey,
  ScenarioValues,
  scenarioFieldKeys,
  applyRandomization,
  generateSeed,
} from '../../scenarioSchema'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'

/**
 * Default empty preferences
 */
const DEFAULT_PREFERENCES: TrainingLauncherPreferences = {
  savedScenarios: [],
  sessions: [],
}

/**
 * Load a scenario preset for customisation.
 *
 * Looks up the preset by ID (from query param), resolves it to get
 * current values (with randomization applied), then populates the
 * form fields via setAnswer().
 *
 * Checks both built-in presets and user-saved scenarios.
 *
 * Also sets:
 * - randomizeFields: array of field keys that should be randomized
 * - originalScenarioName: display name of the base preset
 *
 * Usage:
 * ```typescript
 * onAccess: [
 *   accessTransition({
 *     effects: [TrainingSessionLauncherEffects.loadScenarioForCustomise()],
 *   }),
 * ]
 * ```
 */
export const loadScenarioForCustomise =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const scenarioIdParam = context.getQueryParam('scenario')
    const scenarioId = Array.isArray(scenarioIdParam) ? scenarioIdParam[0] : scenarioIdParam

    if (!scenarioId) {
      return
    }

    // First check built-in presets
    const preset = getPresetById(scenarioId)

    if (preset) {
      const excludedFields = getExcludedFields(preset.flags)
      const resolved = resolvePreset(preset, undefined, excludedFields)
      populateForm(context, resolved.values, resolved.randomizeFields, preset.name, preset.flags)

      return
    }

    // Check user-saved scenarios in preferences
    const preferencesId = context.getState('preferencesId')

    if (preferencesId) {
      const preferences = await deps.preferencesStore.get<{ trainingLauncher?: TrainingLauncherPreferences }>(
        preferencesId,
      )
      const trainingLauncher = preferences?.trainingLauncher ?? DEFAULT_PREFERENCES
      const savedScenario = trainingLauncher.savedScenarios.find(s => s.id === scenarioId)

      if (savedScenario) {
        const seed = generateSeed()
        const excludedFields = getExcludedFields(savedScenario.flags)
        const randomizeFields = getRandomizeFields(savedScenario.fixedValues, excludedFields)
        const values = applyRandomization(savedScenario.fixedValues, randomizeFields, seed)
        populateForm(context, values, randomizeFields, savedScenario.name, savedScenario.flags)

        return
      }
    }

    // Fall back to default preset if not found anywhere
    const defaultPreset = scenarioPresets[0]
    const defaultExcludedFields = getExcludedFields(defaultPreset.flags)
    const resolved = resolvePreset(defaultPreset, undefined, defaultExcludedFields)

    populateForm(context, resolved.values, resolved.randomizeFields, defaultPreset.name, defaultPreset.flags)
  }

/**
 * Populate form data from resolved scenario values.
 * Fields use defaultValue to read from this data via Data('scenario.fieldKey').
 */
function populateForm(
  context: TrainingSessionLauncherContext,
  values: ScenarioValues,
  randomizeFields: ScenarioFieldKey[],
  presetName: string,
  flags: TrainingScenarioFlag[],
): void {
  const randomizeSet = new Set(randomizeFields)

  context.setData('scenario', values)
  context.setData('flags', flags)
  context.setData('originalScenarioName', presetName)

  // Set per-field randomize flags for RandomizableField components
  for (const fieldKey of scenarioFieldKeys) {
    const key = `${fieldKey}_isRandomized`

    context.setData(key, randomizeSet.has(fieldKey))
  }
}
