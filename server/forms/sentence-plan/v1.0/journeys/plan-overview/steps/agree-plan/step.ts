import { next, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

export const agreePlanStep = step({
  path: '/agree-plan',
  title: 'Agree Plan',
  view: {
    locals: {
      buttons: {
        // TODO: add conditional boolean depending on user's auth
        showReturnToOasysButton: false,
        showCreateGoalButton: false,
        showAgreePlanButton: false,
      },
    },
  },
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [next({ goto: 'plan' })],
      },
    }),
  ],
})
