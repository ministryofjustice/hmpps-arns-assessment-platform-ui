import { block, journey, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKButton } from '@form-engine/registry/components/govuk-frontend/button/govukButton'
import { RoshScreeningEffects } from '../../../effects'
import * as riskToOthers from './fields/riskToOthers'

const URL = {
  riskToOthers: '/risk-to-others',
}

const riskToOthersTypeGroup = [
  riskToOthers.possessionUseWeaponsDetails,
  riskToOthers.otherSeriousOffenceDetails,
  riskToOthers.civilAncillaryOrdersYesDetails,
  riskToOthers.previouslyConvictedOffences,
  riskToOthers.significantBehavioursOrEvents,
  riskToOthers.civilOrAncillaryOrders,
]

const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  name: 'action',
  value: 'continue',
})

export default journey({
  code: 'rosh-screening-risk-to-others',
  title: 'Risk to others',
  path: '', // TODO: What would the path be? do we want it as rosh-screening/risk-to-others??
  // TODO: Require a transition here? What will it look like?
  steps: [
    step({
      path: URL.riskToOthers,
      blocks: [...riskToOthersTypeGroup, continueButton],
      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            effects: [RoshScreeningEffects.Save()],
            next: [{ goto: '' }], // TODO: Should go to Risk to children when page exists
          },
          onInvalid: {
            effects: [RoshScreeningEffects.Save()],
            next: [{ goto: '@self' }],
          },
        }),
      ],
    }),
  ],
})
