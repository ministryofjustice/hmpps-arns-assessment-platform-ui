import { access, Condition, Self, step, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKHeading,
  GovUKPasswordInput,
  GovUKSelectInput,
  GovUKTextInput
} from '@ministryofjustice/hmpps-forge/govuk-components'
import config from '../../../../../config'
import { DataDeletionToolEffects } from '../../../effects';
import { editComponent } from './fields';

export const editStep = step({
  path: '/edit',
  title: 'Edit',
  onAccess: [
    access({
      effects: [
        DataDeletionToolEffects.loadData(),
      ],
    })
  ],
  blocks: [
    GovUKHeading({
      text: 'Edit',
    }),
    editComponent,
    GovUKButton({
      text: 'Test',
      name: 'action',
      value: 'test',
    }),
  ],
})
