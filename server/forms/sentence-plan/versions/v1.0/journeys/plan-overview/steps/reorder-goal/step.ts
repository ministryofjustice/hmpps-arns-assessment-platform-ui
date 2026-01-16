import { accessTransition, loadTransition, next, Query, step } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { SentencePlanEffects } from '../../../../../../effects'

/**
 * Reorder goal step
 *
 * This is a "fire and redirect" step that reorders a goal and immediately
 * redirects back to the plan overview. No UI is rendered.
 *
 * Query params:
 * - goalUuid: UUID of the goal to move
 * - direction: 'up' or 'down'
 * - status: Goal status for redirect (ACTIVE, FUTURE, ACHIEVED, REMOVED)
 */
export const reorderGoalStep = step({
  path: '/reorder-goal',
  title: 'Reorder Goal',
  isEntryPoint: true,

  blocks: [], // No visible content - immediate redirect

  onLoad: [
    loadTransition({
      effects: [SentencePlanEffects.deriveGoalsWithStepsFromAssessment(), SentencePlanEffects.reorderGoal()],
    }),
  ],

  onAccess: [
    // Redirect back to plan overview with appropriate tab based on status
    accessTransition({
      guards: Query('status').match(Condition.Equals('FUTURE')),
      redirect: [next({ goto: 'overview?type=future' })],
    }),
    accessTransition({
      guards: Query('status').match(Condition.Equals('ACHIEVED')),
      redirect: [next({ goto: 'overview?type=achieved' })],
    }),
    accessTransition({
      guards: Query('status').match(Condition.Equals('REMOVED')),
      redirect: [next({ goto: 'overview?type=removed' })],
    }),
    // Default fallback for ACTIVE or any other status
    accessTransition({
      guards: Query('status').match(Condition.IsRequired()),
      redirect: [next({ goto: 'overview?type=current' })],
    }),
    // Final fallback if no status provided
    accessTransition({
      redirect: [next({ goto: 'overview?type=current' })],
    }),
  ],
})
