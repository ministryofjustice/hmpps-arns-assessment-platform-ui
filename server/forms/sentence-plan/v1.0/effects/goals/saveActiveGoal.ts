import { BadRequest, InternalServerError } from 'http-errors'
import { EffectFunction } from '../index'
import { GoalAnswers, GoalProperties, GoalStatus, SentencePlanContext } from '../types'
import { wrapAll } from '../../../../../data/aap-api/wrappers'

/**
 * Create a new goal
 *
 * Uses the GOALS collection UUID from derived data, or creates the collection
 * if it doesn't exist. Stores the goal UUID in context for navigation to add-steps.
 *
 * Form fields used:
 * - goal_title: Goal title
 * - areaOfNeed (param): Primary area of need slug
 * - related_areas_of_need: Related areas (if applicable)
 * - can_start_now: 'yes' or 'no'
 * - target_date_option: Target date option
 * - custom_target_date: Custom date (if set_another_date)
 */
export const saveActiveGoal: EffectFunction = deps => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const areaOfNeedSlug = context.getRequestParam('areaOfNeed')
  const assessmentUuid = context.getData('assessmentUuid')

  if (!user) {
    throw new InternalServerError('User is required to save a goal')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to save a goal')
  }

  if (!areaOfNeedSlug) {
    throw new BadRequest('Area of need is required to save a goal')
  }

  // Get form answers
  const goalTitle = context.getAnswer('goal_title')
  const relatedAreas = context.getAnswer('related_areas_of_need') ?? []
  const canStartNow = context.getAnswer('can_start_now')
  const targetDateOption = context.getAnswer('target_date_option')
  const customDate = context.getAnswer('custom_target_date')

  // Calculate target date
  let targetDate

  if (canStartNow === 'yes') {
    const today = new Date()

    switch (targetDateOption) {
      case 'date_in_3_months':
        today.setMonth(today.getMonth() + 3)
        targetDate = today.toISOString()
        break
      case 'date_in_6_months':
        today.setMonth(today.getMonth() + 6)
        targetDate = today.toISOString()
        break
      case 'date_in_12_months':
        today.setMonth(today.getMonth() + 12)
        targetDate = today.toISOString()
        break
      case 'set_another_date':
        if (customDate) {
          targetDate = new Date(customDate).toISOString()
        }
        break
      default:
    }
  }

  // Get or create GOALS collection
  let goalsCollectionUuid = context.getData('goalsCollectionUuid')

  if (!goalsCollectionUuid) {
    const createResult = await deps.api.executeCommand({
      type: 'CreateCollectionCommand',
      name: 'GOALS',
      assessmentUuid,
      user,
    })

    goalsCollectionUuid = createResult.collectionUuid
  }

  // Determine goal status based on whether they can start now
  const status: GoalStatus = canStartNow === 'yes' ? 'ACTIVE' : 'FUTURE'

  const properties: GoalProperties = {
    status,
    status_date: new Date().toISOString(),
  }

  const answers: GoalAnswers = {
    title: goalTitle,
    area_of_need: areaOfNeedSlug,
    related_areas_of_need: relatedAreas,
    target_date: targetDate,
  }

  // Create the goal
  const addResult = await deps.api.executeCommand({
    type: 'AddCollectionItemCommand',
    collectionUuid: goalsCollectionUuid,
    properties: wrapAll(properties),
    answers: wrapAll(answers),
    timeline: {
      type: 'GOAL_CREATED',
      data: {},
    },
    assessmentUuid,
    user,
  })

  // Store goal UUID for redirect to add-steps
  context.setData('activeGoalUuid', addResult.collectionItemUuid)
}
