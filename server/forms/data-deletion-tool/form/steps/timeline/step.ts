import { redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { timelineComponent } from './fields';
import { DataDeletionToolEffects } from '../../../effects';

export const timelineStep = step({
  path: '/timeline',
  title: 'Timeline',
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          DataDeletionToolEffects.saveTimeline(),
          DataDeletionToolEffects.deletionDryRun(),
        ],
        next: [redirect({ goto: 'summary' })],
      },
    })
  ],
  blocks: [
    timelineComponent,
    GovUKButton({
      text: 'Next',
      name: 'action',
      value: 'next',
      preventDoubleClick: true,
    }),
  ],
})
