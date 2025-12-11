import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovUKDateInputFull } from '@form-engine-govuk-components/components/date-input/govukDateInputVariants'
import { GovukTextareaInput } from '@form-engine-govuk-components/components/textarea-input/govukTextareaInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Answer, block, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { and } from '@form-engine/form/builders/PredicateTestExprBuilder'

export const hygieneRatingHeading = block<HtmlBlock>({
  variant: 'html',
  content: `
    <h1 class="govuk-heading-l">Food hygiene rating</h1>
    <p class="govuk-body">If you have already been inspected by your local authority, provide your rating.</p>
  `,
})

export const hasHygieneRating = field<GovUKRadioInput>({
  code: 'hasHygieneRating',
  variant: 'govukRadioInput',
  label: 'Have you received a food hygiene rating?',
  items: [
    { value: 'yes', text: 'Yes' },
    { value: 'no', text: 'No' },
    { value: 'awaiting', text: 'Awaiting first inspection' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select whether you have received a food hygiene rating',
    }),
  ],
})

export const hygieneRating = field<GovUKRadioInput>({
  code: 'hygieneRating',
  variant: 'govukRadioInput',
  label: 'What is your food hygiene rating?',
  hint: '0 is the lowest rating, 5 is the highest',
  hidden: Answer('hasHygieneRating').not.match(Condition.Equals('yes')),
  items: [
    { value: '5', text: '5 - Very good' },
    { value: '4', text: '4 - Good' },
    { value: '3', text: '3 - Generally satisfactory' },
    { value: '2', text: '2 - Improvement necessary' },
    { value: '1', text: '1 - Major improvement necessary' },
    { value: '0', text: '0 - Urgent improvement necessary' },
  ],
  validate: [
    validation({
      when: and(Answer('hasHygieneRating').match(Condition.Equals('yes')), Self().not.match(Condition.IsRequired())),
      message: 'Select your food hygiene rating',
    }),
  ],
})

export const hygieneInspectionDate = field<GovUKDateInputFull>({
  code: 'hygieneInspectionDate',
  variant: 'govukDateInputFull',
  label: 'When was your last inspection?',
  hint: 'For example, 27 3 2024',
  hidden: Answer('hasHygieneRating').not.match(Condition.Equals('yes')),
  validate: [
    validation({
      when: and(Answer('hasHygieneRating').match(Condition.Equals('yes')), Self().not.match(Condition.IsRequired())),
      message: 'Enter the date of your last inspection',
    }),
    validation({
      when: and(Answer('hasHygieneRating').match(Condition.Equals('yes')), Self().match(Condition.Date.IsFutureDate())),
      message: 'Inspection date must be in the past',
    }),
  ],
})

export const improvementNotes = field<GovukTextareaInput>({
  code: 'improvementNotes',
  variant: 'govukTextarea',
  label: 'What improvements are you making?',
  hint: 'Describe the actions you are taking to improve your rating',
  hidden: Answer('hygieneRating').not.match(Condition.Array.IsIn(['0', '1', '2'])),
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: and(
        Answer('hygieneRating').match(Condition.Array.IsIn(['0', '1', '2'])),
        Self().not.match(Condition.IsRequired()),
      ),
      message: 'Describe the improvements you are making',
    }),
  ],
})

export const saveAndContinueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'continue',
})
