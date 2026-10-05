import { TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKButton, GovUKButtonGroup, GovUKHeading } from '@ministryofjustice/hmpps-forge/govuk-components'
import { goalContextInsetText } from '../sharedFields'
import { StepSummaryCardList } from '../../../../../components/step-summary-card/stepSummaryCardList'

const pageHeading = GovUKHeading({
  text: 'Reorder steps',
})

const stepSummaryCardList = StepSummaryCardList({ page: 'reorder-steps' })

const saveAndContinueButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'saveAndContinue',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'reorder-steps-save-and-continue-button',
  },
})

const cancelButton = GovUKButton({
  text: 'Cancel',
  name: 'action',
  value: 'cancel',
  classes: 'govuk-button--secondary',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'reorder-steps-cancel-button',
  },
})

const actionButtons = GovUKButtonGroup({ buttons: [saveAndContinueButton, cancelButton] })

export const pageLayout = TemplateWrapper({
  template: `
    <div>
      {{slot:pageHeading}}
      {{slot:goalContextInsetText}}
      {{slot:stepSummaryCardList}}
      {{slot:actionButtons}}
    </div>
  `,
  slots: {
    pageHeading: [pageHeading],
    goalContextInsetText: [goalContextInsetText],
    stepSummaryCardList: [stepSummaryCardList],
    actionButtons: [actionButtons],
  },
})
