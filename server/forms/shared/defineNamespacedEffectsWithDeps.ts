import { FunctionRegistryObject } from '@form-engine/registry/types/functions.type'
import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'
import { EffectFunctionExpr, ValueExpr } from '@form-engine/form/types/expressions.type'
import { FunctionType } from '@form-engine/form/types/enums'
import { isAsyncFunction } from '@form-engine/registry/utils/createRegisterableFunction'

/**
 * Utility type that extracts all parameters except the first from a tuple type.
 */
type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never

/**
 * Type helper to extract the evaluator function type from a factory function.
 */
type EvaluatorFromFactory<F> = F extends (deps: unknown) => infer E ? E : never

/**
 * Type helper to safely extract parameters from evaluator, with fallback to unknown[].
 */
type SafeTailParams<F> = F extends (...args: unknown[]) => unknown ? Tail<Parameters<F>> : unknown[]

/**
 * Type for the function builders that create effect expressions.
 */
type EffectBuildersFromFactories<Fns> = {
  [K in keyof Fns]: (
    ...args: SafeTailParams<EvaluatorFromFactory<Fns[K]>>
  ) => EffectFunctionExpr<SafeTailParams<EvaluatorFromFactory<Fns[K]>>>
}

/**
 * A factory function that creates an effect evaluator when given dependencies.
 */
type EffectFactory<D> = (deps: D) => (context: EffectFunctionContext, ...args: ValueExpr[]) => void | Promise<void>

/**
 * Capitalizes the first letter of a string.
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Creates namespaced effect functions with dependency injection.
 *
 * This is similar to `defineEffectsWithDeps` but prefixes the registry names
 * with a namespace to avoid collisions when multiple forms define effects
 * with the same name.
 *
 * - The `effects` object uses short names for convenience: `effects.addNotification()`
 * - The registry uses namespaced names: `trainingLauncherAddNotification`
 *
 * @template D - The dependencies type
 * @param namespace - The prefix for registry names (camelCase, e.g., 'trainingLauncher')
 *
 * @example
 * ```typescript
 * export const { effects, createRegistry } = defineNamespacedEffectsWithDeps<MyDeps>('trainingLauncher')({
 *   addNotification: (deps) => (context, notification) => { ... },
 *   loadNotifications: (deps) => (context, target) => { ... },
 * })
 *
 * // Usage in forms:
 * effects.addNotification({ ... })  // Short name for convenience
 *
 * // Registry keys:
 * // - trainingLauncherAddNotification
 * // - trainingLauncherLoadNotifications
 * ```
 */
export function defineNamespacedEffectsWithDeps<D>(namespace: string) {
  return <Fns extends Record<string, EffectFactory<D>>>(factories: Fns) => {
    type Builders = EffectBuildersFromFactories<Fns>

    // Create builders with short names but namespaced internal name
    const effects = {} as Builders

    Object.keys(factories).forEach(shortName => {
      const namespacedName = `${namespace}${capitalize(shortName)}`
      ;(effects as Record<string, unknown>)[shortName] = (...args: unknown[]): EffectFunctionExpr<unknown[]> => ({
        type: FunctionType.EFFECT,
        name: namespacedName, // Registry lookup uses namespaced name
        arguments: args,
      })
    })

    // Factory function to create registry with namespaced keys
    const createRegistry = (deps: D): FunctionRegistryObject => {
      const registry = {} as FunctionRegistryObject

      Object.entries(factories).forEach(([shortName, factory]) => {
        const namespacedName = `${namespace}${capitalize(shortName)}`
        const evaluate = factory(deps)
        const isAsync = isAsyncFunction(evaluate)
        ;(registry as Record<string, unknown>)[namespacedName] = {
          name: namespacedName,
          evaluate,
          isAsync,
        }
      })

      return registry
    }

    return { effects, createRegistry }
  }
}
