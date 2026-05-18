import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'

const MAX_STACK_SIZE = 10

/**
 * Inserts a navigation key onto the session stack.
 *
 * Use this when a non-linear journey needs to set a specific referrer context
 * for subsequent pages — for example, when an action transition kicks off a
 * sub-flow that wouldn't otherwise be tracked by URL matching.
 *
 * No-ops if the key is already at the top of the stack (avoids duplicates).
 *
 * Use via createNavigationEffects() rather than calling directly — the factory
 * ensures the same stackKey is used as in trackNavigation() for the same service.
 */
export async function insertNavigationReferrer(
  context: EffectFunctionContext,
  key: string,
  { stackKey }: { stackKey: string },
): Promise<void> {
  const session = context.getSession() as Record<string, string[] | undefined> | undefined
  const stack: string[] = session?.[stackKey] ?? []

  if (stack.at(-1) === key) {
    return
  }

  const newStack = [...stack, key]

  if (session) {
    session[stackKey] = newStack.length > MAX_STACK_SIZE ? newStack.slice(-MAX_STACK_SIZE) : newStack
  }
}
