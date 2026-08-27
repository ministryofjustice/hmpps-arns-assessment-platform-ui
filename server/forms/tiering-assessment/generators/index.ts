import { GeneratorRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { getTextFromListDefinition } from './getTextFromListDefinition'
import { getFormatterDateFromIso } from './getFormatterDateFromIso'
import { TieringAssessmentEffectsDeps } from '../@types/TieringAssessmentEffectsDeps'

export const sanGenerators = new GeneratorRegistry<TieringAssessmentEffectsDeps>()

export const SANGenerators = {
  getTextFromListDefinition: sanGenerators.register('getTextFromListDefinition', getTextFromListDefinition),
  getFormatterDateFromIso: sanGenerators.register('getFormatterDateFromIso', getFormatterDateFromIso),
}
