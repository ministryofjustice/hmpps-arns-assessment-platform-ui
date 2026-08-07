import { defineConditionFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'

export const { conditions: StrengthsAndNeedsConditions, implementations: strengthsAndNeedsConditionImplementations } =
  defineConditionFunctions<
    {
      IsArray: (value: unknown) => boolean
    },
    StrengthsAndNeedsEffectsDeps
  >({
    IsArray:
      () =>
      (value: unknown): boolean =>
        Array.isArray(value),
  })
