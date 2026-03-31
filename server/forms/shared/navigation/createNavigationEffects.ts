import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'
import { trackNavigation, NavKeyPatterns } from './trackNavigation'
import { insertNavigationReferrer } from './insertNavigationReferrer'

export interface NavigationEffectsConfig {
  /**
   * Session key used to store this service's navigation stack.
   * Use a service-specific value (e.g. 'sentence-plan') to avoid collisions
   * when multiple services share the same session.
   */
  stackKey: string
  /**
   * Nav key that clears the stack on visit — typically the service's hub page.
   * Omit to disable auto-clear entirely.
   */
  clearKey?: string
  /**
   * Data key written to expose the predecessor page for backlink logic.
   * Defaults to 'navigationReferrer'.
   */
  referrerKey?: string
}

/**
 * Creates a pair of effect-shaped navigation functions bound to a service's config.
 *
 * Binding at registration time ensures that trackNavigation and insertNavigationReferrer
 * always use the same stackKey, preventing silent mismatches at call sites.
 *
 * @example
 * // In a service's effects/index.ts:
 * const { trackNavigation, insertNavigationReferrer } = createNavigationEffects({
 *   stackKey: 'my-service',
 *   clearKey: Nav.HOME,
 * })
 *
 * export const { effects: MyEffects, ... } = defineEffectsWithDeps<MyDeps>()({
 *   trackNavigation,
 *   insertNavigationReferrer,
 *   ...
 * })
 *
 * // In the journey's onAccess:
 * MyEffects.trackNavigation(NAV_KEY_PATTERNS)
 *
 * // In a step's onAccess (non-linear sub-flow):
 * MyEffects.insertNavigationReferrer(Nav.ADD_ITEM)
 */
export function createNavigationEffects(config: NavigationEffectsConfig) {
  return {
    trackNavigation:
      () =>
      async (context: EffectFunctionContext, patterns: NavKeyPatterns): Promise<void> =>
        trackNavigation(context, patterns, config),

    insertNavigationReferrer:
      () =>
      async (context: EffectFunctionContext, key: string): Promise<void> =>
        insertNavigationReferrer(context, key, config),
  }
}
