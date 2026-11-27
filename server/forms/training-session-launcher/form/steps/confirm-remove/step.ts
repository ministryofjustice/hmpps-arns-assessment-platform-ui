import { step, submit, access, redirect, Data, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { confirmRemoveForm } from './fields'
import { ConfirmRemoveEffects } from './effects'

/**
 * Confirm Remove Step
 *
 * Asks the trainer to confirm before removing a session, all sessions or a saved scenario.
 * The calling page redirects here with `item` (session, all-sessions or scenario) and `id` query parameters.
 * Only "Yes, remove" runs the delete; "Cancel" goes back without changes.
 */
export const confirmRemoveStep = step({
  path: '/confirm-remove',
  title: Data('removal.question'),
  reachability: { entryWhen: true },

  blocks: [confirmRemoveForm],

  onAccess: [
    access({
      effects: [ConfirmRemoveEffects.loadRemovalTarget()],
    }),

    access({
      when: Data('removal.item').not.match(Condition.IsRequired()),
      next: [redirect({ goto: 'sessions' })],
    }),
  ],

  onSubmission: [
    submit({
      onAlways: {
        effects: [ConfirmRemoveEffects.confirmRemoval()],
        next: [redirect({ goto: Data('removalReturnPath') })],
      },
    }),
  ],
})
