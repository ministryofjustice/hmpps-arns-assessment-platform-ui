import { ConditionRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import { unescape } from './transformers/html-encoder'

export const sanConditions = new ConditionRegistry<StrengthsAndNeedsEffectsDeps>()

export const StrengthsAndNeedsConditions = {
  IsArray: sanConditions.register(
    'IsArray',
    () =>
      (value: unknown): boolean =>
        Array.isArray(value),
  ),
  HasMaxLength: sanConditions.register(
    'HasMaxLength',
    () =>
      (value: string, maxLength: number): boolean =>
        unescape(value).length <= maxLength,
  ),
}
