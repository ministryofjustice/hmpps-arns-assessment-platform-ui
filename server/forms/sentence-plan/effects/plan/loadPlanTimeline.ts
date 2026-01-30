import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Load plan timeline events from the API
 *
 * Fetches timeline events filtered by custom type using the TimelineQuery.
 * Currently loads GOAL_ACHIEVED events for plan history display.
 *
 * Sets:
 * - Data('planTimeline'): Array of TimelineItem objects from the API
 */
export const loadPlanTimeline = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')

  if (!user) {
    throw new InternalServerError('User is required to load plan timeline')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to load plan timeline')
  }

  const result = await deps.api.executeQuery({
    type: 'TimelineQuery',
    includeCustomTypes: ['GOAL_ACHIEVED'],
    assessmentIdentifier: { type: 'UUID', uuid: assessmentUuid },
    user,
  })

  context.setData('planTimeline', result.timeline)
}
