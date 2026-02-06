import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import { getRequiredEffectContext, getPractitionerName } from './goalUtils'
import { getOrCreateNotesCollection, buildAddNoteCommand } from './noteUtils'

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
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'markGoalAsAchieved')
  const activeGoal = context.getData('activeGoal')

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required for markGoalAsAchieved')
  }

  const practitionerName = getPractitionerName(context, user)

  // Read form answers before building commands (needed for timeline data)
  const howHelped = context.getAnswer('how_helped')

  const commands: Commands[] = []

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
        achievedBy: practitionerName,
        notes: (typeof howHelped === 'string' && howHelped.trim()) || undefined,
      },
    },
    assessmentUuid,
    user,
  })

  // 2. Add achieved note if provided
  if (howHelped && typeof howHelped === 'string' && howHelped.trim().length > 0) {
    const collectionUuid = await getOrCreateNotesCollection(deps, { activeGoal, assessmentUuid, user })

    commands.push(
      buildAddNoteCommand({
        collectionUuid,
        noteText: howHelped,
        noteType: 'ACHIEVED',
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
