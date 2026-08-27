import { ConditionRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffectsDeps } from '../@types/TieringAssessmentEffectsDeps'

export const sanConditions = new ConditionRegistry<TieringAssessmentEffectsDeps>()

export const StrengthsAndNeedsConditions = {
  IsArray: sanConditions.register(
    'IsArray',
    () =>
      (value: unknown): boolean =>
        Array.isArray(value),
  ),
}
