import { block } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine/registry/components/govuk-frontend/button/govukButton'
import * as riskToOthers from './fields/riskToOthers'

export const URL = {
  riskToOthers: '/risk-to-others',
}

export const riskToOthersTypeGroup = [
  riskToOthers.possessionUseWeaponsDetails,
  riskToOthers.otherSeriousOffenceDetails,
  riskToOthers.civilAncillaryOrdersYesDetails,
  riskToOthers.previouslyConvictedOffences,
  riskToOthers.significantBehavioursOrEvents,
  riskToOthers.civilOrAncillaryOrders,
]

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  name: 'action',
  value: 'continue',
})
