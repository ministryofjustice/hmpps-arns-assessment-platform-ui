import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Answer, block, Data, field, Format, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKTextInput } from '@form-engine-govuk-components/components/text-input/govukTextInput'
import { or } from '@form-engine/form/builders/PredicateTestExprBuilder'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'

export const assessmentIdDisplay = block<HtmlBlock>({
  variant: 'html',
  content: Format('<p class="govuk-body-s">Assessment ID: %1</p>', Data('assessment.assessmentUuid')),
})

const tradingHoursField = field<GovUKTextInput>({
  code: 'tradingHours',
  variant: 'govukTextInput',
  label: 'What are your typical trading hours?',
  hint: 'For example, "Monday to Friday, 11am to 3pm"',
  formatters: [Transformer.String.Trim(), Transformer.String.ToUpperCase()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your typical trading hours',
    }),
  ],
  dependent: or(
    Answer('businessType').match(Condition.Equals('food-stall')),
    Answer('businessType').match(Condition.Equals('food-van')),
  ),
})

export const businessType = field<GovUKRadioInput>({
  code: 'businessType',
  variant: 'govukRadioInput',
  label: 'What type of food business are you registering?',
  hint: 'Select the option that best describes your business',
  items: [
    {
      value: 'restaurant',
      text: 'Restaurant',
      hint: 'A full-service restaurant with table service',
    },
    {
      value: 'cafe',
      text: 'Café or coffee shop',
      hint: 'A café, coffee shop, or tea room',
    },
    {
      value: 'food-stall',
      text: 'Market stall or street food',
      hint: 'A market stall, street food stall, or pop-up',
      block: tradingHoursField,
    },
    {
      value: 'catering',
      text: 'Catering service',
      hint: 'Mobile catering for events and functions',
    },
    {
      value: 'food-van',
      text: 'Food van or truck',
      hint: 'A mobile food van or truck',
      block: tradingHoursField,
    },
  ],
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select the type of food business you are registering',
    }),
  ],
})

export const saveAndContinueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'continue',
})
