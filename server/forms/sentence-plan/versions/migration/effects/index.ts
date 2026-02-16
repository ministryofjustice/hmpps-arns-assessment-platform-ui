import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import { migrateFromV3ToV4 } from '../migrateToV4'
import { SentencePlanEffectsDeps } from '../../../effects/types'

export const { effects: SentencePlanEffects, createRegistry: SentencePlanEffectsRegistry } =
  defineEffectsWithDeps<SentencePlanEffectsDeps>()({
    migrateFromV3ToV4,
  })
