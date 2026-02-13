import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import { getRequiredEffectContext, getPractitionerName } from './goalUtils'
import { getOrCreateNotesCollection, buildAddNoteCommand } from './noteUtils'

/**
 * Mark a goal as removed
 *
 * This effect:
 * 1. Updates the goal status to 'REMOVED'
 * 2. Clears the target_date (so it doesn't persist if re-added as a future goal)
 * 3. Adds a removal note
 *
 * Unlike `deleteActiveGoal`, this is a soft-delete that can be undone
 * via the `confirm-readd-goal` flow. Used for agreed plans only.
 *
 * Form fields used:
 * - removal_note: Optional note about why the goal was removed
 */
export const markGoalAsRemoved = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'markGoalAsRemoved')
  const activeGoal = context.getData('activeGoal')

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required for markGoalAsRemoved')
  }

  const practitionerName = getPractitionerName(context, user)

  // Read form answers before building commands (needed for timeline data)
  const removalNote = context.getAnswer('removal_note')

  const commands: Commands[] = []

  // 1. Update goal status to REMOVED
  commands.push({
    type: 'UpdateCollectionItemPropertiesCommand',
    collectionItemUuid: activeGoal.uuid,
    added: wrapAll({
      status: 'REMOVED',
      status_date: new Date().toISOString(),
    }),
    removed: [],
    timeline: {
      type: 'GOAL_REMOVED',
      data: {
        goalUuid: activeGoal.uuid,
        goalTitle: activeGoal.title,
        removedBy: practitionerName,
        reason: (typeof removalNote === 'string' && removalNote.trim()) || undefined,
      },
    },
    assessmentUuid,
    user,
  })

  // 2. Clear target_date so it doesn't persist if the goal is re-added as a future goal
  commands.push({
    type: 'UpdateCollectionItemAnswersCommand',
    collectionItemUuid: activeGoal.uuid,
    added: {},
    removed: ['target_date'],
    assessmentUuid,
    user,
  })

  // 3. Add removal note if provided
  if (removalNote && typeof removalNote === 'string' && removalNote.trim().length > 0) {
    const collectionUuid = await getOrCreateNotesCollection(deps, { activeGoal, assessmentUuid, user })

    commands.push(
      buildAddNoteCommand({
        collectionUuid,
        noteText: removalNote,
        noteType: 'REMOVED',
        createdBy: practitionerName,
        assessmentUuid,
        user,
      }),
    )
  }

  // Execute all commands in a single batch
  if (commands.length > 0) {
    await deps.api.executeCommands(...commands)
  }
}
