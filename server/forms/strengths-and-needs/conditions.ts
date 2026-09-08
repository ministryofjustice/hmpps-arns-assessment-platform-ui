import { ConditionRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'

export const sanConditions = new ConditionRegistry<StrengthsAndNeedsEffectsDeps>()

export const StrengthsAndNeedsConditions = {
  IsArray: sanConditions.register(
    'IsArray',
    () =>
      (value: unknown): boolean =>
        Array.isArray(value),
  ),
}
