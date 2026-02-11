import { accessTransition, Data, redirect, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, continueButton } from './fields'
import { sentencePlanOverviewPath } from '../../../../constants'

export const updateAgreePlanStep = step({
  path: '/update-agree-plan',
  title: 'Do they agree?',
  blocks: [pageHeading, continueButton],
  onAccess: [
    accessTransition({
      when: Data('sessionDetails.accessMode').match(Condition.Equals('READ_ONLY')),
      next: [redirect({ goto: sentencePlanOverviewPath })],
    }),
  ],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [redirect({ goto: 'plan' })],
      },
    }),
  ],
})
