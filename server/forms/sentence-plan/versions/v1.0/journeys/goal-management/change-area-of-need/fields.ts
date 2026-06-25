import { Data, Self, validation, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton, GovUKHeading, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { areasOfNeed } from '../../../constants'

const sortedAreasOfNeed = [...areasOfNeed].sort((a, b) => a.text.localeCompare(b.text))

export const pageHeading = GovUKHeading({
  text: 'Change area of need',
})

export const areaOfNeedField = GovUKRadioInput({
  code: 'area_of_need',
  fieldset: {
    legend: {
      text: 'What is the area of need?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  // Pre-select the goal's current area of need.
  items: sortedAreasOfNeed.map(({ slug, text }) => ({
    value: slug,
    text,
    checked: Data('activeGoal.areaOfNeed').match(Condition.Equals(slug)),
  })),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select an area of need',
    }),
  ],
})

export const continueButton = GovUKButton({
  text: 'Continue',
  name: 'action',
  value: 'continue',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'change-area-of-need-continue-button',
  },
})
