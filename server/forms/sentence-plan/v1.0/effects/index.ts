import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'
import { defineVersionedEffects } from '../../utils/versionedRegistry'
import { AssessmentPlatformApiClient, DeliusApiClient } from '../../../../data'
import { loadPersonByCrn } from './loadPersonByCrn'
import { loadOrCreatePlanByCrn } from './loadOrCreatePlanByCrn'
import { loadOrCreatePlanByOasys } from './loadOrCreatePlanByOasys'
import { saveGoal } from './saveGoal'

/**
 * Dependencies for sentence plan effects
 */
export interface SentencePlanEffectsDeps {
  api: AssessmentPlatformApiClient
  deliusApi: DeliusApiClient
}

/**
 * Type for an individual effect function
 */
export type EffectFunction = (deps: SentencePlanEffectsDeps) => (context: EffectFunctionContext) => Promise<void>

/**
 * Sentence Plan v1.0 Effects
 *
 * These effects handle:
 * - Loading/creating sentence plans
 * - Managing goals and steps (CRUD)
 * - Plan agreement workflow
 * - Progress notes
 *
 * Usage in forms:
 * ```typescript
 * import { SentencePlanV1Effects } from './effects'
 *
 * SentencePlanV1Effects.loadOrCreatePlanByCrn()
 * SentencePlanV1Effects.saveGoal()
 * ```
 */
export const { effects: SentencePlanV1Effects, createRegistry: SentencePlanV1Registry } =
  defineVersionedEffects<SentencePlanEffectsDeps>('SentencePlan.V1')({
    // Assessment
    loadPersonByCrn,
    loadOrCreatePlanByCrn,
    loadOrCreatePlanByOasys,

    // Goals
    saveGoal,
  })
