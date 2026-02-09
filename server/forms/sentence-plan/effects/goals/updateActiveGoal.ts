import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import {
  getRequiredEffectContext,
  getPractitionerName,
  calculateTargetDate,
  determineGoalStatus,
  buildGoalProperties,
  buildGoalAnswers,
} from './goalUtils'

/**
 * Update an existing goal
 *
 * Updates the goal's answers (title, areas of need, target date) and
 * properties (status, status_date) based on form field values.
 *
 * If the goal is changed to a future goal (can_start_now = 'no'),
 * the target_date is cleared to prevent stale data being displayed.
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
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'updateActiveGoal')
  const activeGoal = context.getData('activeGoal')

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required for updateActiveGoal')
  }

  const practitionerName = getPractitionerName(context, user)

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

  // If changing to a future goal, clear the target_date
  const answersToRemove = targetDate ? [] : ['target_date']

  // Batch both updates in a single API call for atomicity
  const commands: Commands[] = [
    {
      type: 'UpdateCollectionItemAnswersCommand',
      collectionItemUuid: activeGoal.uuid,
      added: wrapAll(answers),
      removed: answersToRemove,
      timeline: {
        type: 'GOAL_UPDATED',
        data: {
          goalUuid: activeGoal.uuid,
          goalTitle: goalTitle || activeGoal.title,
          updatedBy: practitionerName,
        },
      },
      assessmentUuid,
      user,
    },
    {
      type: 'UpdateCollectionItemPropertiesCommand',
      collectionItemUuid: activeGoal.uuid,
      added: wrapAll(properties),
      removed: [],
      assessmentUuid,
      user,
    },
  ]

  await deps.api.executeCommands(...commands)
}
