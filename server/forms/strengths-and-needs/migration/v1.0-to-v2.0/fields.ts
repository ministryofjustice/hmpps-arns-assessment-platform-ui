import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButton,
  GovUKHeading,
  GovUKTextareaInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'

export const migrationNoteCode = 'poc_migration_note'

export const updatedHeading = GovUKHeading({ text: 'This assessment has been updated', size: 'l', level: 1 })

export const updatedExplanation = GovUKBody({
  text: 'The strengths and needs assessment has a new version. Before you carry on, tell us anything that has changed since it was last updated. You will also need to check the accommodation section again.',
})

export const migrationNoteField = GovUKTextareaInput({
  code: migrationNoteCode,
  label: { text: 'What has changed since this assessment was last updated?', classes: 'govuk-label--m' },
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Enter what has changed since this assessment was last updated',
    }),
  ],
})

export const continueButton = GovUKButton({ text: 'Continue', name: 'action', value: 'continue' })
