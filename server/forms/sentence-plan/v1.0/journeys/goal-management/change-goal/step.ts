import { next, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

export const changeGoalStep = step({
  path: '/change-goal',
  title: 'Change Goal',
  isEntryPoint: true,
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        // TODO: Save goal changes and return to plan overview
        next: [next({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
