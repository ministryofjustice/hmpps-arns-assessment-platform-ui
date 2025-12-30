import { next, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

export const agreePlanStep = step({
  path: '/agree-plan',
  title: 'Agree Plan',
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [next({ goto: 'plan' })],
      },
    }),
  ],
})
