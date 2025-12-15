import { Format, next, Params, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

/**
 * For manually marking a goal as removed
 * This is used AFTER a plan is agreed to remove a goal from a plan
 * Unlike `delete`, it is not permanent, and the goal can be brought
 * back using `confirm-readd-goal`
 */
export const removeGoalStep = step({
  path: '/confirm-remove-goal',
  title: 'Remove Goal',
  isEntryPoint: true,
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        next: [next({ goto: '/confirm-delete-goal' })],
      },
    }),
  ],
})
