import { journey, next, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import * as riskToOthersIndex from './risk-to-others/index'

export const roshScreening = journey({
  code: 'rosh_screening',
  title: 'ROSH screening',
  path: '/rosh-screening',
  version: '1.0',
  steps: [
    step({
      path: riskToOthersIndex.URL.riskToOthers,
      blocks: [...riskToOthersIndex.riskToOthersTypeGroup, riskToOthersIndex.continueButton],
      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            // TODO: Save data
            next: [next({ goto: '/rosh-screening/risk-to-children' })], // TODO: Update to correct URL when page exists
          },
          onInvalid: {
            // TODO: Save data
            next: [next({ goto: '@self' })],
          },
        }),
      ],
    }),
  ],
})
