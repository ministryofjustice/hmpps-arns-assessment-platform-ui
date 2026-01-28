import { redirect, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

export const updateAgreePlanStep = step({
  path: '/update-agree-plan',
  title: 'Do they agree?',
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [redirect({ goto: 'plan' })],
      },
    }),
  ],
})
