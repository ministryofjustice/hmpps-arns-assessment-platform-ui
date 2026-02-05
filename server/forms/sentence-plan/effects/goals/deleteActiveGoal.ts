import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { assertGoalEffectContext } from './goalUtils'

/**
 * Delete the active goal
 *
 * Permanently removes the goal from the assessment using RemoveCollectionItemCommand.
 * This is used for draft plans where the goal hasn't been agreed yet.
 *
 * Requires activeGoal to be set in context (via loadActiveGoalForEdit or setActiveGoalContext).
 */
export const deleteActiveGoal = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid, activeGoal } = assertGoalEffectContext(context, 'deleteActiveGoal')

  await deps.api.executeCommand({
    type: 'RemoveCollectionItemCommand',
    collectionItemUuid: activeGoal.uuid,
    timeline: {
      type: 'GOAL_DELETED',
      data: {},
    },
    assessmentUuid,
    user,
  })
}
