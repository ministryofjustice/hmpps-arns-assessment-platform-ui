import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const interviewQuestionField = GovUKRadioInput({
  code: 'have-you-done-an-interview',
  items: [
    { value: 'true', text: 'Yes, continue assessment', hint: 'Answer questions needed for the dynamic scores.' },
    { value: 'false', text: 'No', hint: 'Check your answers and view static scores.' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})
