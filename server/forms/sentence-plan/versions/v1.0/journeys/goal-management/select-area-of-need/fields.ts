import { Format, Query, Self, validation, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton, GovUKHeading, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { areasOfNeed, CaseData } from '../../../constants'

const sortedAreasOfNeed = [...areasOfNeed].sort((a, b) => a.text.localeCompare(b.text))

export const pageHeading = GovUKHeading({
  text: Format('Create a goal with %1', CaseData.Forename),
})

export const areaOfNeedField = GovUKRadioInput({
  code: 'area_of_need',
  fieldset: {
    legend: {
      text: 'What is the area of need?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  // Pre-select the area when returning from add-goal (?area=<slug>); nothing selected on first entry.
  items: sortedAreasOfNeed.map(({ slug, text }) => ({
    value: slug,
    text,
    checked: Query('area').match(Condition.Equals(slug)),
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
    'data-ai-id': 'select-area-of-need-continue-button',
  },
})
