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
  const assessmentUuid = context.getData('assessmentUuid')
  const activeGoal = context.getData('activeGoal')

  if (!user) {
    throw new InternalServerError('User is required to mark goal as achieved')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to mark goal as achieved')
  }

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required to mark as achieved')
  }

  const commands: Commands[] = []

  // 1. Update goal status to ACHIEVED
  commands.push({
    type: 'UpdateCollectionItemPropertiesCommand',
    collectionItemUuid: activeGoal.uuid,
    added: wrapAll({
      status: 'ACHIEVED',
      status_date: new Date().toISOString(),
      achieved_by: user.name,
    }),
    removed: [],
    assessmentUuid,
    user,
  })

  // 2. Add achieved note if provided
  const howHelped = context.getAnswer('how_helped')
  if (howHelped && typeof howHelped === 'string' && howHelped.trim().length > 0) {
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
        note: howHelped.trim(),
        created_by: user.name,
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
