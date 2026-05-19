import {
  access,
  redirect,
  step,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffects } from '../../../effects'

export const clearStep = step({
  path: '/clear',
  title: 'Clear session',
  reachability: { entryWhen: true },
  onAccess: [
    access({
      effects: [
        DataDeletionToolEffects.clearSession(),
      ],
      next: [redirect({ goto: 'configuration' })]
    })
  ],
})
