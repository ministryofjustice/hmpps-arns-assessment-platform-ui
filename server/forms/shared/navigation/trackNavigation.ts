import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'

const MAX_STACK_SIZE = 10

/**
 * URL substring patterns mapping a navigation key to a URL fragment.
 * Any Record<string, string> is valid — the key is what gets stored in the stack.
 */
export type NavKeyPatterns = Record<string, string>

function findMatchingKey(patterns: NavKeyPatterns, url: string): string | null {
  for (const [key, pattern] of Object.entries(patterns)) {
    if (url.includes(pattern)) {
      return key
    }
  }

  return null
}

/**
 * Tracks the current page in a named session navigation stack and exposes
 * the predecessor as a data value for backlink logic.
 *
 * Use via createNavigationEffects() rather than calling directly — the factory
 * binds stackKey, clearKey and referrerKey so they stay consistent with
 * insertNavigationReferrer() for the same service.
 *
 * Behaviour by case:
 * - Untracked page (no URL match): stack unchanged, referrer = top of stack
 * - Clear key matched: stack cleared, referrer = null
 * - Reload (matched key already at stack top): stack unchanged, referrer = second-to-top
 * - Back-navigation (key in stack, not at top): stack trimmed to that key, referrer = new second-to-top
 * - Forward navigation (new key): key pushed, referrer = second-to-top
 *
 * Stack is capped at 10 entries to prevent unbounded session growth.
 */
export async function trackNavigation(
  context: EffectFunctionContext,
  patterns: NavKeyPatterns,
  {
    stackKey,
    clearKey,
    referrerKey = 'navigationReferrer',
  }: { stackKey: string; clearKey?: string; referrerKey?: string },
): Promise<void> {
  const url = context.getRequestUrl()
  const session = context.getSession() as Record<string, string[] | undefined> | undefined
  const stack: string[] = session?.[stackKey] ?? []

  const currentKey = findMatchingKey(patterns, url)

  if (currentKey === null) {
    // Untracked page: don't modify the stack, expose the top as referrer
    context.setData(referrerKey, stack.at(-1) ?? null)
    return
  }

  if (clearKey !== undefined && currentKey === clearKey) {
    if (session) {
      session[stackKey] = []
    }

    context.setData(referrerKey, null)
    return
  }

  const topKey = stack.at(-1)

  if (currentKey === topKey) {
    // Reload: no-op on the stack, expose the second-to-top as predecessor
    context.setData(referrerKey, stack.at(-2) ?? null)
    return
  }

  const existingIdx = stack.indexOf(currentKey)

  let newStack: string[]

  if (existingIdx !== -1) {
    // Back-navigation: trim everything past this key
    newStack = stack.slice(0, existingIdx + 1)
  } else {
    // Forward navigation: push, enforcing the size cap
    const pushed = [...stack, currentKey]
    newStack = pushed.length > MAX_STACK_SIZE ? pushed.slice(-MAX_STACK_SIZE) : pushed
  }

  if (session) {
    session[stackKey] = newStack
  }

  context.setData(referrerKey, newStack.at(-2) ?? null)
}
