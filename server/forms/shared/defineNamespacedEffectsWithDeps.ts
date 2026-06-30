import type { EffectFunctionContext, ForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { EffectFunctionExpr, FunctionType } from '@ministryofjustice/hmpps-forge/core/authoring'

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
type EffectFactory<D> = (deps: D) => (context: EffectFunctionContext, ...args: unknown[]) => void | Promise<void>

type FunctionImplementations<D> = NonNullable<ForgePackage<D>['functions']>

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
 * export const { effects, implementations } = defineNamespacedEffectsWithDeps<MyDeps>('trainingLauncher')({
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
        name: namespacedName,
        arguments: args,
      })
    })

    const implementations = Object.fromEntries(
      Object.entries(factories).map(([shortName, factory]) => [`${namespace}${capitalize(shortName)}`, factory]),
    ) as FunctionImplementations<D>

    return { effects, implementations }
  }
}
