import { Data, Format, next, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { continueButton } from './fields'

export const aboutPersonStep = step({
  path: '/about-person',
  title: 'About the Person',
  view: {
    locals: {
      headerPageHeading: Format(`About %1`, Data('caseData.name.forename')),
      buttons: {
        showReturnToOasysButton: Data('user.authSource').match(Condition.Equals('handover')),
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
