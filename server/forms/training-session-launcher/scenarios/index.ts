import { fakerEN_GB as faker } from '@faker-js/faker'
import {
  scenarioFieldSchema,
  scenarioFieldKeys,
  ScenarioFieldKey,
  ScenarioValues,
  PartialScenarioValues,
  ScenarioFieldConfig,
} from './schema'

export { generateSeed } from './helpers'
export { scenarioFieldSchema, scenarioFieldKeys } from './schema'
export type { ScenarioFieldKey, ScenarioValues, PartialScenarioValues, ScenarioFieldConfig } from './schema'
export { scenarioPresets, getPresetById, getRandomizeFields, resolvePreset, resolveAllPresets } from './presets'
export type { ScenarioPreset, ResolvedScenario } from './presets'

/**
 * Get field keys by group
 */
export function getFieldsByGroup(group: ScenarioFieldConfig<unknown>['group']): ScenarioFieldKey[] {
  return scenarioFieldKeys.filter(key => scenarioFieldSchema[key].group === group)
}

/**
 * Apply randomization to specified fields, keeping fixed values for others.
 *
 * If a seed is provided, faker is seeded first to ensure reproducible results.
 * Same seed + same randomizeFields = same output values.
 *
 * @param fixedValues - Values that should not be randomized
 * @param randomizeFields - Fields that should be randomized
 * @param seed - Optional seed for reproducible randomization
 */
export function applyRandomization(
  fixedValues: PartialScenarioValues,
  randomizeFields: ScenarioFieldKey[],
  seed?: number,
): ScenarioValues {
  if (seed !== undefined) {
    faker.seed(seed)
  }

  const result = { ...fixedValues } as Record<string, unknown>

  for (const fieldKey of randomizeFields) {
    const fieldConfig = scenarioFieldSchema[fieldKey]

    result[fieldKey] = fieldConfig.randomize()
  }

  return result as ScenarioValues
}

/**
 * Generate a fully randomized scenario (all fields randomized)
 *
 * @param seed - Optional seed for reproducible randomization
 */
export function generateFullyRandomizedScenario(seed?: number): ScenarioValues {
  return applyRandomization({}, scenarioFieldKeys, seed)
}

/**
 * Get the label for a field
 */
export function getFieldLabel(fieldKey: ScenarioFieldKey): string {
  return scenarioFieldSchema[fieldKey].label
}
