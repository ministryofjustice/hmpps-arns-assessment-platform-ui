import { Format, next, Params, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, confirmButton } from './fields'

/**
 * For manually marking a goal as deleted
 * This is used BEFORE a plan is agreed to remove a goal from a plan
 * Unlike `remove`, it is permanent.
 */
export const confirmDeleteGoalStep = step({
  path: '/confirm-delete-goal',
  title: 'Confirm Delete Goal',
  blocks: [pageHeading, confirmButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        // TODO: Execute remove goal effect
        next: [next({ goto: '/view-removed-goal' })],
      },
    }),
  ],
})
