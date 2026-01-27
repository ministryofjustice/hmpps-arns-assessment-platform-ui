import { Data, Format, redirect, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { continueButton } from './fields'
import { CaseData } from '../../constants'

export const aboutPersonStep = step({
  path: '/about-person',
  title: 'About',
  view: {
    locals: {
      headerPageHeading: Format(`About %1`, CaseData.Forename),
      buttons: {
        showReturnToOasysButton: Data('sessionDetails.accessType').match(Condition.Equals('handover')),
        showCreateGoalButton: true,
      },
      // Hardcoded error until we have About page setup:
      errorMessage: 'Some areas have incomplete information',
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
