import { Data, Format, redirect, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { continueButton } from './fields'
import { CaseData } from '../../constants'

export const aboutPersonStep = step({
  path: '/about-person',
  title: 'About the Person',
  view: {
    locals: {
      headerPageHeading: Format(`About %1`, CaseData.Forename),
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
        next: [redirect({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
