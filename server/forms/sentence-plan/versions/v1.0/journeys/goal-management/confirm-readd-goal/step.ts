import { redirect, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, confirmButton } from './fields'

export const confirmAddGoalStep = step({
  path: '/confirm-readd-goal',
  title: 'Confirm Re-add Goal',
  blocks: [pageHeading, confirmButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        // TODO: Execute re-add goal effect
        next: [redirect({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
