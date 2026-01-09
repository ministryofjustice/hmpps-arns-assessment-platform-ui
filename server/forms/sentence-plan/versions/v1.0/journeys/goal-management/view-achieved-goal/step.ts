import { next, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, backToPlanButton } from './fields'

/**
 * For viewing an achieved goal.
 * This is only accessible when a plan has been agreed.
 * // TODO: This might be mergeable with `view-removed-goal`
 */
export const viewAchievedGoalStep = step({
  path: '/view-achieved-goal',
  title: 'View Achieved Goal',
  isEntryPoint: true,
  blocks: [pageHeading, backToPlanButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [next({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
