import { TrainingScenarioFlag } from '../constants'
import { ScenarioFieldKey, PartialScenarioValues, ScenarioValues, scenarioFieldKeys } from './schema'
import { generateSeed } from './helpers'
import { applyRandomization } from './index'

/**
 * A scenario preset definition.
 * Fields not in fixedValues will be randomized on load.
 */
export interface ScenarioPreset {
  id: string
  name: string
  shortDescription: string
  description: string
  flags: TrainingScenarioFlag[]

  /**
   * Fixed values that won't change between loads.
   * All other fields will be randomized.
   */
  fixedValues: PartialScenarioValues
}

/**
 * Compute which fields should be randomized.
 * Returns all fields not in fixedValues and not in excludedFields.
 * Excluded fields remain undefined (not fixed, not randomized).
 *
 * @param fixedValues - Fields with fixed values
 * @param excludedFields - Fields to exclude entirely (remain undefined)
 */
export function getRandomizeFields(
  fixedValues: PartialScenarioValues,
  excludedFields?: Set<ScenarioFieldKey>,
): ScenarioFieldKey[] {
  const fixedKeys = new Set(Object.keys(fixedValues))

  return scenarioFieldKeys.filter(key => !fixedKeys.has(key) && !excludedFields?.has(key))
}

/**
 * A resolved scenario with all values populated (fixed + randomized)
 */
export interface ResolvedScenario {
  id: string
  name: string
  shortDescription: string
  description: string
  flags: TrainingScenarioFlag[]
  values: ScenarioValues
  randomizeFields: ScenarioFieldKey[]
  /** Seed used to generate randomized values - same seed produces same values */
  seed: number
}

/**
 * Pre-configured scenario presets
 */
export const scenarioPresets: ScenarioPreset[] = [
  {
    id: 'default',
    name: 'Default',
    shortDescription: 'All fields randomized',
    description: 'Scenario with fully randomized subject details and practitioner details.',
    flags: [],
    fixedValues: {
      accessMode: 'READ_WRITE',
      planAccessMode: 'READ_WRITE',
    },
  },
  {
    id: 'sp-national-rollout',
    name: 'SP National Rollout',
    shortDescription: 'National rollout scenario',
    description: 'Scenario configured for Sentence Plan national rollout in a community/probation setting.',
    flags: [],
    fixedValues: {
      location: 'COMMUNITY',
      accessMode: 'READ_WRITE',
      planAccessMode: 'READ_WRITE',
    },
  },
  {
    id: 'sp-private-beta',
    name: 'SP Private Beta',
    shortDescription: 'Private Beta scenario',
    description: 'Scenario configured for Sentence Plan with private beta access.',
    flags: ['SAN_PRIVATE_BETA'],
    fixedValues: {
      location: 'COMMUNITY',
      accessMode: 'READ_WRITE',
      planAccessMode: 'READ_WRITE',
    },
  },
]

/**
 * Get a scenario preset by ID
 */
export function getPresetById(id: string): ScenarioPreset | undefined {
  return scenarioPresets.find(preset => preset.id === id)
}

/**
 * Resolve a preset into a full scenario with all values populated.
 *
 * Generates a seed for reproducible randomization. Pass the same seed
 * to applyRandomization to get the same values.
 *
 * @param preset - The preset to resolve
 * @param seed - Optional seed; if not provided, generates a new one
 * @param excludedFields - Optional fields to exclude from randomization (remain undefined)
 */
export function resolvePreset(
  preset: ScenarioPreset,
  seed?: number,
  excludedFields?: Set<ScenarioFieldKey>,
): ResolvedScenario {
  const resolvedSeed = seed ?? generateSeed()
  const randomizeFields = getRandomizeFields(preset.fixedValues, excludedFields)

  return {
    id: preset.id,
    name: preset.name,
    shortDescription: preset.shortDescription,
    description: preset.description,
    flags: preset.flags,
    values: applyRandomization(preset.fixedValues, randomizeFields, resolvedSeed),
    randomizeFields,
    seed: resolvedSeed,
  }
}

/**
 * Resolve all presets into full scenarios
 *
 * @param getExcludedFieldsForFlags - Optional function to compute excluded fields from flags
 */
export function resolveAllPresets(
  getExcludedFieldsForFlags?: (flags: TrainingScenarioFlag[]) => Set<ScenarioFieldKey>,
): ResolvedScenario[] {
  return scenarioPresets.map(preset => resolvePreset(preset, undefined, getExcludedFieldsForFlags?.(preset.flags)))
}
