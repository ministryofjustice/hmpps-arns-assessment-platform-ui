import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKCheckboxInput } from '@form-engine-govuk-components/components/checkbox-input/govukCheckboxInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { block, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'

export const reviewHeading = block<HtmlBlock>({
  variant: 'html',
  content: `
    <h1 class="govuk-heading-l">Check your answers before submitting</h1>
    <p class="govuk-body">Review your information carefully before submitting your registration.</p>

    <h2 class="govuk-heading-m">Business details</h2>
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Business type</dt>
        <dd class="govuk-summary-list__value" id="review-business-type"></dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Business name</dt>
        <dd class="govuk-summary-list__value" id="review-business-name"></dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Address</dt>
        <dd class="govuk-summary-list__value" id="review-address"></dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Contact email</dt>
        <dd class="govuk-summary-list__value" id="review-email"></dd>
      </div>
    </dl>

    <h2 class="govuk-heading-m">Menu items</h2>
    <p class="govuk-body" id="menu-items-count"></p>
  `,
})

export const declaration = field<GovUKCheckboxInput>({
  code: 'declaration',
  variant: 'govukCheckboxInput',
  multiple: true,
  items: [
    {
      value: 'confirmed',
      text: 'I confirm that the information I have provided is accurate to the best of my knowledge',
    },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.Array.Contains('confirmed')),
      message: 'You must confirm that the information is accurate before submitting',
    }),
  ],
})

export const submitButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Submit registration',
  name: 'action',
  value: 'submit',
})
