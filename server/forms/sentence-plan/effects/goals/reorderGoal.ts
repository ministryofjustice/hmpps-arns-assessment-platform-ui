import { InternalServerError } from 'http-errors'
import { DerivedGoal, SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Reorder a goal within its status group.
 *
 * Moves a goal up or down by swapping positions with an adjacent goal of the same status.
 * Goals in different statuses remain unaffected - this preserves the logical grouping
 * of ACTIVE, FUTURE, ACHIEVED, and REMOVED goals on the plan overview page.
 *
 * Query params:
 * - goalUuid: UUID of the goal to move
 * - direction: 'up' or 'down' within the same status group
 */
export const reorderGoal = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')
  const goals = context.getData('goals') as DerivedGoal[]

  const goalUuid = context.getQueryParam('goalUuid') as string | undefined
  const direction = context.getQueryParam('direction') as 'up' | 'down' | undefined

  // Missing params indicates malformed URL or direct access - redirect silently to overview
  if (!goalUuid || !direction) {
    return
  }

  if (!user) {
    throw new InternalServerError('User is required to reorder a goal')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to reorder a goal')
  }

  // Empty plan - nothing to reorder
  if (!goals?.length) {
    return
  }

  // Goal not found - may have been deleted; redirect safely
  const goal = goals.find(g => g.uuid === goalUuid)
  if (!goal) {
    return
  }

  // Get all goals with the same status, sorted by collection index
  const sameStatusGoals = goals
    .filter(g => g.status === goal.status)
    .sort((a, b) => a.collectionIndex - b.collectionIndex)

  // Find position within status group (shouldn't fail if goal exists, but be defensive)
  const filteredIndex = sameStatusGoals.findIndex(g => g.uuid === goalUuid)
  if (filteredIndex === -1) {
    return
  }

  // Check boundary - can't move first goal up or last goal down within its status group
  const adjacentFilteredIndex = direction === 'up' ? filteredIndex - 1 : filteredIndex + 1
  if (adjacentFilteredIndex < 0 || adjacentFilteredIndex >= sameStatusGoals.length) {
    return
  }

  const adjacentGoal = sameStatusGoals[adjacentFilteredIndex]

  // Swap positions by moving current goal to adjacent goal's collection index
  await deps.api.executeCommand({
    type: 'ReorderCollectionItemCommand',
    collectionItemUuid: goal.uuid,
    index: adjacentGoal.collectionIndex,
    assessmentUuid,
    user,
  })
}
