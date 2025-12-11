import { GovUKCheckboxInput } from '@form-engine-govuk-components/components/checkbox-input/govukCheckboxInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { block, field } from '@form-engine/form/builders'
import { squad2ProgressOptions } from '../../options'

export const progressHeading = block<HtmlBlock>({
  variant: 'html',
  content: `
    <h2 class="govuk-heading-m">Squad 2 (Phoenix) - What's been done this week</h2>
    <p class="govuk-body">Select all that apply</p>
  `,
})

export const progressChecklist = field<GovUKCheckboxInput>({
  code: 'squad2ProgressItems',
  variant: 'govukCheckboxInput',
  label: 'Progress updates',
  multiple: true,
  items: squad2ProgressOptions,
})

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Wrap it up',
  name: 'action',
  value: 'continue',
})
