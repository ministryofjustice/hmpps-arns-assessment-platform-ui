import { InternalServerError } from 'http-errors'
import { SentencePlanEffectsDeps } from '../index'
import { SentencePlanContext } from '../types'
import { wrapAll } from '../../../../../data/aap-api/wrappers'
import { calculateTargetDate, determineGoalStatus, buildGoalProperties, buildGoalAnswers } from './goal-utils'

/**
 * Update an existing goal
 *
 * Updates the goal's answers (title, areas of need, target date) and
 * properties (status, status_date) based on form field values.
 *
 * Form fields used:
 * - goal_title: Goal title
 * - is_related_to_other_areas: 'yes' or 'no'
 * - related_areas_of_need: Related areas (if applicable)
 * - can_start_now: 'yes' or 'no'
 * - target_date_option: Target date option
 * - custom_target_date: Custom date (if set_another_date)
 */
export const updateActiveGoal = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')
  const activeGoal = context.getData('activeGoal')

  if (!user) {
    throw new InternalServerError('User is required to update a goal')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to update a goal')
  }

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required to update')
  }

  // Get form answers
  const goalTitle = context.getAnswer('goal_title')
  const isRelatedToOtherAreas = context.getAnswer('is_related_to_other_areas')
  const relatedAreas = isRelatedToOtherAreas === 'yes' ? (context.getAnswer('related_areas_of_need') ?? []) : []
  const canStartNow = context.getAnswer('can_start_now')
  const targetDateOption = context.getAnswer('target_date_option')
  const customDate = context.getAnswer('custom_target_date')

  // Calculate target date and status
  const targetDate = calculateTargetDate(canStartNow, targetDateOption, customDate)
  const status = determineGoalStatus(canStartNow)

  const properties = buildGoalProperties(status)
  const answers = buildGoalAnswers(goalTitle, activeGoal.areaOfNeed, relatedAreas, targetDate)

  // Update the goal answers
  await deps.api.executeCommand({
    type: 'UpdateCollectionItemAnswersCommand',
    collectionItemUuid: activeGoal.uuid,
    added: wrapAll(answers),
    removed: [],
    timeline: {
      type: 'GOAL_UPDATED',
      data: {},
    },
    assessmentUuid,
    user,
  })

  // Update the goal properties
  await deps.api.executeCommand({
    type: 'UpdateCollectionItemPropertiesCommand',
    collectionItemUuid: activeGoal.uuid,
    added: wrapAll(properties),
    removed: [],
    assessmentUuid,
    user,
  })
}
