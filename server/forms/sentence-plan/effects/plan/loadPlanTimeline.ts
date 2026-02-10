import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Load timeline events for goal lifecycle changes from the API.
 *
 * Fetches GOAL_ACHIEVED, GOAL_REMOVED, GOAL_READDED, and GOAL_UPDATED timeline events
 * and stores the raw timeline items for downstream transformation by
 * derivePlanHistoryEntries.
 *
 * Sets:
 * - Data('planTimeline'): Raw TimelineItem[] from the API
 */
export const loadPlanTimeline = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const session = context.getSession()
  const sessionDetails = session.sessionDetails

  if (!user) {
    throw new InternalServerError('User is required to load plan timeline')
  }

  if (!sessionDetails?.planIdentifier) {
    throw new InternalServerError('Plan identifier is required to load plan timeline')
  }

  const result = await deps.api.executeQuery({
    type: 'TimelineQuery',
    includeCustomTypes: ['GOAL_ACHIEVED', 'GOAL_REMOVED', 'GOAL_READDED', 'GOAL_UPDATED'],
    assessmentIdentifier: sessionDetails.planIdentifier,
    user,
  })

  context.setData('planTimeline', result.timeline ?? [])
}
