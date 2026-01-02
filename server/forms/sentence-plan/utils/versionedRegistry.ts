import {
  defineEffectsWithDeps,
  defineTransformersWithDeps,
  defineConditionsWithDeps,
} from '@form-engine/registry/utils/createRegisterableFunction'
import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'

// =============================================================================
// Type Definitions
// =============================================================================

type EffectFn<TDeps> = (deps: TDeps) => (context: EffectFunctionContext, ...args: unknown[]) => void | Promise<void>

type TransformerFn<TDeps> = (deps: TDeps) => (value: unknown, ...args: unknown[]) => unknown

type ConditionFn<TDeps> = (deps: TDeps) => (value: unknown, ...args: unknown[]) => boolean | Promise<boolean>

// =============================================================================
// Effects
// =============================================================================

/**
 * Create versioned effects with namespaced registry keys
 *
 * @example
 * ```typescript
 * const { effects: V1, createRegistry } =
 *   defineVersionedEffects<MyDeps>('SentencePlan.V1')({
 *     loadOrCreatePlan: deps => async context => { ... },
 *   })
 *
 * export const SentencePlan = { V1 }
 *
 * // Usage: SentencePlan.V1.loadOrCreatePlan()
 * // Registry key: "SentencePlan.V1.loadOrCreatePlan"
 * ```
 */
export function defineVersionedEffects<TDeps>(namespace: string) {
  return function createVersionedEffects<TEffects extends Record<string, EffectFn<TDeps>>>(definitions: TEffects) {
    const prefixedDefinitions: Record<string, EffectFn<TDeps>> = {}

    Object.keys(definitions).forEach(key => {
      prefixedDefinitions[`${namespace}.${key}`] = definitions[key]
    })

    const { effects: prefixedEffects, createRegistry } = defineEffectsWithDeps<TDeps>()(prefixedDefinitions)

    const effects = {} as { [K in keyof TEffects]: (typeof prefixedEffects)[string] }

    Object.keys(definitions).forEach(key => {
      effects[key as keyof TEffects] = prefixedEffects[`${namespace}.${key}`]
    })

    return { effects, createRegistry }
  }
}

// =============================================================================
// Transformers
// =============================================================================

/**
 * Create versioned transformers with namespaced registry keys
 *
 * @example
 * ```typescript
 * const { transformers: V1, createRegistry } =
 *   defineVersionedTransformers<MyDeps>('SentencePlan.V1')({
 *     formatGoalTitle: deps => value => { ... },
 *   })
 *
 * export const SentencePlanTransformer = { V1 }
 *
 * // Usage: SentencePlanTransformer.V1.formatGoalTitle()
 * // Registry key: "SentencePlan.V1.formatGoalTitle"
 * ```
 */
export function defineVersionedTransformers<TDeps>(namespace: string) {
  return function createVersionedTransformers<TTransformers extends Record<string, TransformerFn<TDeps>>>(
    definitions: TTransformers,
  ) {
    const prefixedDefinitions: Record<string, TransformerFn<TDeps>> = {}

    Object.keys(definitions).forEach(key => {
      prefixedDefinitions[`${namespace}.${key}`] = definitions[key]
    })

    const { transformers: prefixedTransformers, createRegistry } =
      defineTransformersWithDeps<TDeps>()(prefixedDefinitions)

    const transformers = {} as { [K in keyof TTransformers]: (typeof prefixedTransformers)[string] }

    Object.keys(definitions).forEach(key => {
      transformers[key as keyof TTransformers] = prefixedTransformers[`${namespace}.${key}`]
    })

    return { transformers, createRegistry }
  }
}

// =============================================================================
// Conditions
// =============================================================================

/**
 * Create versioned conditions with namespaced registry keys
 *
 * @example
 * ```typescript
 * const { conditions: V1, createRegistry } =
 *   defineVersionedConditions<MyDeps>('SentencePlan.V1')({
 *     isGoalActive: deps => value => { ... },
 *   })
 *
 * export const SentencePlanCondition = { V1 }
 *
 * // Usage: SentencePlanCondition.V1.isGoalActive()
 * // Registry key: "SentencePlan.V1.isGoalActive"
 * ```
 */
export function defineVersionedConditions<TDeps>(namespace: string) {
  return function createVersionedConditions<TConditions extends Record<string, ConditionFn<TDeps>>>(
    definitions: TConditions,
  ) {
    const prefixedDefinitions: Record<string, ConditionFn<TDeps>> = {}

    Object.keys(definitions).forEach(key => {
      prefixedDefinitions[`${namespace}.${key}`] = definitions[key]
    })

    const { conditions: prefixedConditions, createRegistry } = defineConditionsWithDeps<TDeps>()(prefixedDefinitions)

    const conditions = {} as { [K in keyof TConditions]: (typeof prefixedConditions)[string] }

    Object.keys(definitions).forEach(key => {
      conditions[key as keyof TConditions] = prefixedConditions[`${namespace}.${key}`]
    })

    return { conditions, createRegistry }
  }
}
