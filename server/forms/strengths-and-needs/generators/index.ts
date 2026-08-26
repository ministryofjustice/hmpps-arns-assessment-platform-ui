import { GeneratorRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { getTextFromListDefinition } from './getTextFromListDefinition'
import { getFormatterDateFromIso } from './getFormatterDateFromIso'
import { getDrugValueLower } from './getDrugValueLower'
import { StrengthsAndNeedsEffectsDeps } from '../effects/types'

export const sanGenerators = new GeneratorRegistry<StrengthsAndNeedsEffectsDeps>()

export const SANGenerators = {
  getTextFromListDefinition: sanGenerators.register('getTextFromListDefinition', getTextFromListDefinition),
  getFormatterDateFromIso: sanGenerators.register('getFormatterDateFromIso', getFormatterDateFromIso),
  getDrugValueLower: sanGenerators.register('getDrugValueLower', getDrugValueLower),
}
