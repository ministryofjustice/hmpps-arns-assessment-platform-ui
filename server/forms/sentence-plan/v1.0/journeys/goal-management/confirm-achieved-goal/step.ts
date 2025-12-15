import { Format, next, Params, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, confirmButton } from './fields'

/**
 * For manually marking a goal as achieved.
 */
export const confirmAchievedGoalStep = step({
  path: '/confirm-achieved-goal',
  title: 'Confirm Goal Achieved',
  blocks: [pageHeading, confirmButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        // TODO: Execute achieve goal effect
        next: [next({ goto: '/view-achieved-goal' })],
      },
    }),
  ],
})
