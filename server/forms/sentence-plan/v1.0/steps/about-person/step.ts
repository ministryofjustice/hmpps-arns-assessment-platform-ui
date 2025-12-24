import { Data, Format, next, step, submitTransition } from '@form-engine/form/builders'
import { continueButton } from './fields'

export const aboutPersonStep = step({
  path: '/about-person',
  title: 'About the Person',
  view: {
    locals: {
      headerPageHeading: Format(`About %1`, Data('caseData.name.forename')),
      buttons: {
        // TODO: add conditional statement depending on user's auth etc
        showReturnToOasysButton: true,
        showCreateGoalButton: true,
      },
    },
  },
  blocks: [continueButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [next({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
