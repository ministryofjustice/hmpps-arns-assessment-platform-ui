import {
  access,
  redirect,
  step, tieBreaker,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffects } from '../../../effects'

export const clearStep = step({
  path: '/clear',
  title: 'Clear session',
  reachability: {
    entryWhen: true,
    tieBreakers: [tieBreaker({ priority: 0 })],
  },
  onAccess: [
    access({
      effects: [
        DataDeletionToolEffects.clearSession(),
      ],
      next: [redirect({ goto: 'configuration' })]
    })
  ],
})
