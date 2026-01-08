import { next, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

/**
 * For automatically asking the user to confirm a goal is achieved
 * if they have marked all steps as 'Complete' on a goal.
 */
export const confirmIfAchievedStep = step({
  path: '/confirm-if-achieved',
  title: 'Confirm If Achieved',
  isEntryPoint: true,
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        next: [next({ goto: '/confirm-achieved-goal' })],
      },
    }),
  ],
})
