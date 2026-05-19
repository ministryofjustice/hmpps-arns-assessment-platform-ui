import { redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { eventsComponent } from './fields';
import { DataDeletionToolEffects } from '../../../effects';

export const eventsStep = step({
  path: '/events',
  title: 'Events',
  onSubmission: [
    submit({
      validate: true,
      onAlways: {
        effects: [
          DataDeletionToolEffects.saveEvents(),
          DataDeletionToolEffects.deletionDryRun(),
        ],
        next: [redirect({ goto: 'timeline' })],
      },
    })
  ],
  blocks: [
    eventsComponent,
    GovUKButton({
      text: 'Next',
      name: 'action',
      value: 'next',
      preventDoubleClick: true,
    }),
  ],
})
