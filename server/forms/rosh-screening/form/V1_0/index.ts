import { block, journey, next, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKButton } from '@form-engine/registry/components/govuk-frontend/button/govukButton'
import * as riskToOthersIndex from './risk-to-others/index'
import * as otherRisksIndex from './other-risks/index'

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  name: 'action',
  value: 'continue',
})

export const roshScreening = journey({
  code: 'rosh_screening',
  title: 'ROSH screening',
  path: '/rosh-screening',
  version: '1.0',
  steps: [
    step({
      path: riskToOthersIndex.URL.riskToOthers,
      blocks: [...riskToOthersIndex.riskToOthersTypeGroup, continueButton],
      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            // TODO: Save data
            next: [next({ goto: '/rosh-screening/risk-to-children' })],
          },
          onInvalid: {
            // TODO: Save data
            next: [next({ goto: '@self' })],
          },
        }),
      ],
    }),
    step({
      path: otherRisksIndex.URL.otherRisks,
      blocks: [...otherRisksIndex.otherRisksTypeGroup, continueButton],
      onSubmission: [
        submitTransition({
          validate: true,
          when: Post('action').match(Condition.Equals('continue')),
          onValid: {
            // TODO: Save data
            effects: [],
            next: [next({ goto: '/rosh-screening/rosh-confirmation' })], // TODO: branching logic for following pages
          },
          onInvalid: {
            // TODO: Save data
            effects: [],
            next: [next({ goto: '@self' })],
          },
        }),
      ],
    }),
  ],
})
