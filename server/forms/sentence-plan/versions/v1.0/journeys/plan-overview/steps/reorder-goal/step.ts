import { accessTransition, redirect, Query, step } from '@form-engine/form/builders'
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

  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.reorderGoal()],
      next: [
        redirect({
          when: Query('status').match(Condition.Equals('FUTURE')),
          goto: 'overview?type=future',
        }),
        redirect({
          when: Query('status').match(Condition.Equals('ACHIEVED')),
          goto: 'overview?type=achieved',
        }),
        redirect({
          when: Query('status').match(Condition.Equals('REMOVED')),
          goto: 'overview?type=removed',
        }),
        // Fallback for ACTIVE or any other/missing status
        redirect({ goto: 'overview?type=current' }),
      ],
    }),
  ],
})
