import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'

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
  const user = context.getState('user')
  const session = context.getSession()
  const assessmentUuid = context.getData('assessmentUuid')
  const activeGoal = context.getData('activeGoal')

  if (!user) {
    throw new InternalServerError('User is required to mark goal as removed')
  }

  // Use practitioner display name from session (populated from handover context),
  // falling back to user.name for HMPPS Auth users
  const practitionerName = session.practitionerDetails?.displayName || user.name

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to mark goal as removed')
  }

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required to mark as removed')
  }

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

  // 3. Add removal note
  const removalNote = context.getAnswer('removal_note')
  if (removalNote && typeof removalNote === 'string' && removalNote.trim().length > 0) {
    // Find or create NOTES collection for the goal
    let collectionUuid = activeGoal.notesCollectionUuid

    if (!collectionUuid) {
      // Create the NOTES collection (goal doesn't have one yet)
      const createResult = await deps.api.executeCommand({
        type: 'CreateCollectionCommand',
        name: 'NOTES',
        parentCollectionItemUuid: activeGoal.uuid,
        assessmentUuid,
        user,
      })

      collectionUuid = createResult.collectionUuid
    }

    // Add the note with type REMOVED
    commands.push({
      type: 'AddCollectionItemCommand',
      collectionUuid: collectionUuid!,
      properties: wrapAll({
        created_at: new Date().toISOString(),
        type: 'REMOVED',
      }),
      answers: wrapAll({
        note: removalNote.trim(),
        created_by: practitionerName,
      }),
      timeline: {
        type: 'NOTE_ADDED',
        data: {},
      },
      assessmentUuid,
      user,
    })
  }

  // Execute all commands in a single batch
  if (commands.length > 0) {
    await deps.api.executeCommands(...commands)
  }
}
