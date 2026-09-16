import { GeneratorRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { getTextFromListDefinition as getTextFromListDefinitionFn } from './getTextFromListDefinition'
import { getFormatterDateFromIso as getFormatterDateFromIsoFn } from './getFormatterDateFromIso'
import { getDrugValueLower as getDrugValueLowerFn } from './getDrugValueLower'
import { StrengthsAndNeedsEffectsDeps } from '../effects/types'
import { createRoute as createRouteFn } from './route'

export const sanGeneratorRegistry = new GeneratorRegistry<StrengthsAndNeedsEffectsDeps>()

export const getTextFromListDefinition = sanGeneratorRegistry.register(
  'getTextFromListDefinition',
  getTextFromListDefinitionFn,
)
export const getFormatterDateFromIso = sanGeneratorRegistry.register(
  'getFormatterDateFromIso',
  getFormatterDateFromIsoFn,
)
export const getDrugValueLower = sanGeneratorRegistry.register('getDrugValueLower', getDrugValueLowerFn)
export const createRoute = sanGeneratorRegistry.register('createRoute', createRouteFn)

export const SANGenerators = {
  getTextFromListDefinition,
  getFormatterDateFromIso,
  getDrugValueLower,
  createRoute,
}
