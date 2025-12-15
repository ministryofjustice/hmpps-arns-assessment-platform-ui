import { next, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

export const aboutPersonStep = step({
  path: '/about-person',
  title: 'About the Person',
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [next({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})

