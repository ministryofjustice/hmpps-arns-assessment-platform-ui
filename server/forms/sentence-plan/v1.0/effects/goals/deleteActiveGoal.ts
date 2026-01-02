import { InternalServerError } from 'http-errors'
import { SentencePlanEffectsDeps } from '../index'
import { SentencePlanContext } from '../types'

/**
 * Delete the active goal
 *
 * Permanently removes the goal from the assessment using RemoveCollectionItemCommand.
 * This is used for draft plans where the goal hasn't been agreed yet.
 *
 * Requires activeGoal to be set in context (via loadActiveGoalForEdit).
 */
export const deleteActiveGoal = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')
  const activeGoal = context.getData('activeGoal')

  if (!user) {
    throw new InternalServerError('User is required to delete a goal')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to delete a goal')
  }

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal UUID is required to delete a goal')
  }

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
