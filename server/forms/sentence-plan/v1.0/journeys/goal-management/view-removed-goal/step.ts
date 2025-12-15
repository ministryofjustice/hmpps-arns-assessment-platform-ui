import { Format, next, Params, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, reAddButton, backToPlanButton } from './fields'

/**
 * For viewing a removed goal.
 * This is only accessible when a plan has been agreed.
 * // TODO: This might be mergeable with `view-achieved-goal`
 */
export const viewRemovedGoalStep = step({
  path: '/view-removed-goal',
  title: 'View Removed Goal',
  isEntryPoint: true,
  blocks: [pageHeading, reAddButton, backToPlanButton],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('re-add')),
      onAlways: {
        next: [next({ goto: '/confirm-readd-goal' })],
      },
    }),
    submitTransition({
      onAlways: {
        next: [next({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
