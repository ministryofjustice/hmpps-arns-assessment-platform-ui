/**
 * Navigation keys for the sentence plan service.
 *
 * Each key identifies a tracked page in the session navigation stack.
 * PLAN_OVERVIEW is the hub page — visiting it clears the stack for a fresh context.
 *
 * Use Nav.X in place of string literals for autocomplete and refactoring safety.
 */
export const Nav = {
  PLAN_OVERVIEW: 'plan-overview',
  PLAN_HISTORY: 'plan-history',
  PREVIOUS_VERSIONS: 'previous-versions',
  ADD_GOAL: 'add-goal',
  UPDATE_GOAL_STEPS: 'update-goal-steps',
  ABOUT: 'about',
} as const

export type NavigationReferrer = (typeof Nav)[keyof typeof Nav]

/**
 * URL substring patterns for the sentence plan navigation stack.
 *
 * Maps each Nav key to a URL substring that identifies it.
 * Pages whose URLs do not match any entry are "untracked" — they inherit the
 * referrer from the top of the stack without modifying it.
 */
export const NAV_KEY_PATTERNS: Record<NavigationReferrer, string> = {
  [Nav.PLAN_OVERVIEW]: '/plan/overview',
  [Nav.PLAN_HISTORY]: '/plan/plan-history',
  [Nav.PREVIOUS_VERSIONS]: '/plan/previous-versions',
  [Nav.ADD_GOAL]: '/add-goal/',
  [Nav.UPDATE_GOAL_STEPS]: '/update-goal-steps',
  [Nav.ABOUT]: '/about-person',
}
