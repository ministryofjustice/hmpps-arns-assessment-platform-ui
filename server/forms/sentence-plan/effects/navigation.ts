/**
 * Navigation keys for the sentence plan service.
 *
 * Each key identifies a tracked page in the session navigation stack.
 * PLAN_OVERVIEW is the hub page — visiting it clears the stack for a fresh context.
 *
 * Use Nav.X in place of string literals for autocomplete and refactoring safety.
 *
 * When adding a new step:
 *   - Add a key here and a matching entry in NAV_KEY_PATTERNS below
 *   - The unit test in navigation.test.ts will fail if a step is not tracked
 */
export const Nav = {
  PLAN_OVERVIEW: 'plan-overview',
  PLAN_HISTORY: 'plan-history',
  PREVIOUS_VERSIONS: 'previous-versions',
  VIEW_HISTORIC: 'view-historic',
  UPDATE_AGREE_PLAN: 'update-agree-plan',
  AGREE_PLAN: 'agree-plan',
  ADD_GOAL: 'add-goal',
  ADD_STEPS: 'add-steps',
  CHANGE_GOAL: 'change-goal',
  UPDATE_GOAL_STEPS: 'update-goal-steps',
  CONFIRM_DELETE_GOAL: 'confirm-delete-goal',
  CONFIRM_ACHIEVED_GOAL: 'confirm-achieved-goal',
  CONFIRM_IF_ACHIEVED: 'confirm-if-achieved',
  CONFIRM_REMOVE_GOAL: 'confirm-remove-goal',
  CONFIRM_READD_GOAL: 'confirm-readd-goal',
  VIEW_INACTIVE_GOAL: 'view-inactive-goal',
  ABOUT: 'about',
} as const

export type NavigationReferrer = (typeof Nav)[keyof typeof Nav]

/**
 * URL substring patterns for the sentence plan navigation stack.
 *
 * Maps each Nav key to a URL substring that identifies it.
 * trackNavigation uses url.includes(pattern) to match, so ordering matters
 * when one pattern is a substring of another — put the more specific pattern
 * first (e.g. UPDATE_AGREE_PLAN before AGREE_PLAN).
 */
export const NAV_KEY_PATTERNS: Record<NavigationReferrer, string> = {
  [Nav.PLAN_OVERVIEW]: '/plan/overview',
  [Nav.PLAN_HISTORY]: '/plan/plan-history',
  [Nav.PREVIOUS_VERSIONS]: '/plan/previous-versions',
  [Nav.VIEW_HISTORIC]: '/view-historic/',
  [Nav.UPDATE_AGREE_PLAN]: '/update-agree-plan',
  [Nav.AGREE_PLAN]: '/agree-plan',
  [Nav.ADD_GOAL]: '/add-goal/',
  [Nav.ADD_STEPS]: '/add-steps',
  [Nav.CHANGE_GOAL]: '/change-goal',
  [Nav.UPDATE_GOAL_STEPS]: '/update-goal-steps',
  [Nav.CONFIRM_DELETE_GOAL]: '/confirm-delete-goal',
  [Nav.CONFIRM_ACHIEVED_GOAL]: '/confirm-achieved-goal',
  [Nav.CONFIRM_IF_ACHIEVED]: '/confirm-if-achieved',
  [Nav.CONFIRM_REMOVE_GOAL]: '/confirm-remove-goal',
  [Nav.CONFIRM_READD_GOAL]: '/confirm-readd-goal',
  [Nav.VIEW_INACTIVE_GOAL]: '/view-inactive-goal',
  [Nav.ABOUT]: '/about-person',
}
