import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'

/**
 * Mark a goal as achieved
 *
 * This effect:
 * 1. Updates the goal status to 'ACHIEVED'
 * 2. Adds an achieved note if the user entered one (how_helped field)
 *
 * Form fields used:
 * - how_helped: Optional note about how achieving this goal has helped
 */
export const markGoalAsAchieved = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const session = context.getSession()
  const assessmentUuid = context.getData('assessmentUuid')
  const activeGoal = context.getData('activeGoal')

  if (!user) {
    throw new InternalServerError('User is required to mark goal as achieved')
  }

  // Use practitioner display name from session (populated from handover context),
  // falling back to user.name for HMPPS Auth users
  const practitionerName = session.practitionerDetails?.displayName || user.name

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to mark goal as achieved')
  }

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required to mark as achieved')
  }

  const commands: Commands[] = []

  // Read note text early so it can be included in the timeline data
  const howHelped = context.getAnswer('how_helped')
  const noteText = howHelped && typeof howHelped === 'string' ? howHelped.trim() : ''

  // 1. Update goal status to ACHIEVED
  commands.push({
    type: 'UpdateCollectionItemPropertiesCommand',
    collectionItemUuid: activeGoal.uuid,
    added: wrapAll({
      status: 'ACHIEVED',
      status_date: new Date().toISOString(),
      achieved_by: practitionerName,
    }),
    removed: [],
    timeline: {
      type: 'GOAL_ACHIEVED',
      data: {
        goalUuid: activeGoal.uuid,
        goalTitle: activeGoal.title,
        ...(noteText ? { notes: noteText } : {}),
      },
    },
    assessmentUuid,
    user,
  })

  // 2. Add achieved note if provided
  if (noteText) {
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

    // Add the note with type ACHIEVED
    commands.push({
      type: 'AddCollectionItemCommand',
      collectionUuid: collectionUuid!,
      properties: wrapAll({
        created_at: new Date().toISOString(),
        type: 'ACHIEVED',
      }),
      answers: wrapAll({
        note: noteText,
        created_by: practitionerName,
      }),
      assessmentUuid,
      user,
    })
  }

  // Execute all commands in a single batch
  if (commands.length > 0) {
    await deps.api.executeCommands(...commands)
  }
}
