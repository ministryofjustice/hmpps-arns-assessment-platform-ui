import { redirect, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

export const planHistoryStep = step({
  path: '/plan-history',
  title: 'Plan History',
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [redirect({ goto: 'plan' })],
      },
    }),
  ],
})
