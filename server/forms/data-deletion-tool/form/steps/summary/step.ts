import { redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { summaryComponent } from './fields'
import { DataDeletionToolEffects } from '../../../effects'

export const summaryStep = step({
  path: '/summary',
  title: 'Summary',
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          DataDeletionToolEffects.saveAnswers(),
          DataDeletionToolEffects.deletionPersist(),
        ],
        next: [redirect({ goto: 'summary?success=true' })],
      },
    })
  ],
  blocks: [
    summaryComponent,
    GovUKButton({
      text: 'Persist',
      name: 'action',
      value: 'persist',
      preventDoubleClick: true,
    }),
  ],
})
