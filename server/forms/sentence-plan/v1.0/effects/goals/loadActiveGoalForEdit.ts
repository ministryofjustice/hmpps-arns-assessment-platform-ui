import { AreaOfNeed, DerivedGoal, SentencePlanContext } from '../types'
import { getMatchingTargetDateOption } from './goalUtils'

/**
 * Load the active goal and pre-populate form fields for editing
 *
 * Looks up the goal by UUID from the derived goals and:
 * 1. Sets up the context data (activeGoal, activeGoalUuid, area of need data)
 * 2. Pre-populates form field answers with existing goal values
 *
 * Form fields populated:
 * - goal_title: Goal title
 * - is_related_to_other_areas: 'yes' or 'no' based on related areas
 * - related_areas_of_need: Related areas array
 * - can_start_now: 'yes' for ACTIVE goals, 'no' for FUTURE goals
 */
export const loadActiveGoalForEdit = () => async (context: SentencePlanContext) => {
  const goals = context.getData('goals') as DerivedGoal[] | undefined
  const areasOfNeed = context.getData('areasOfNeed') as AreaOfNeed[] | undefined
  const goalUuid = context.getRequestParam('uuid')

  if (!goalUuid || goalUuid === ':uuid') {
    return
  }

  const derivedGoal = goals?.find(goal => goal.uuid === goalUuid)

  if (!derivedGoal) {
    return
  }

  // Set up area of need data based on the goal's area
  const currentAreaOfNeed = areasOfNeed?.find(area => area.slug === derivedGoal.areaOfNeed)
  const otherAreasOfNeed = areasOfNeed?.filter(area => area.slug !== derivedGoal.areaOfNeed) ?? []

  context.setData('currentAreaOfNeed', currentAreaOfNeed)
  context.setData('otherAreasOfNeed', otherAreasOfNeed)

  // Set context data for the active goal (full derived goal for display and editing)
  context.setData('activeGoal', derivedGoal)
  context.setData('activeGoalUuid', goalUuid)

  // Pre-populate form fields with existing values
  context.setAnswer('goal_title', derivedGoal.title)

  // Determine if goal has related areas
  const hasRelatedAreas = derivedGoal.relatedAreasOfNeed && derivedGoal.relatedAreasOfNeed.length > 0
  context.setAnswer('is_related_to_other_areas', hasRelatedAreas ? 'yes' : 'no')

  if (hasRelatedAreas) {
    context.setAnswer('related_areas_of_need', derivedGoal.relatedAreasOfNeed)
  }

  // Determine if goal can start now based on status
  const canStartNow = derivedGoal.status === 'ACTIVE' ? 'yes' : 'no'
  context.setAnswer('can_start_now', canStartNow)

  // If goal is active and has a target date, try to determine the option used
  if (derivedGoal.status === 'ACTIVE' && derivedGoal.targetDate) {
    const matchingOption = getMatchingTargetDateOption(derivedGoal.targetDate)

    if (matchingOption) {
      context.setAnswer('target_date_option', matchingOption)
    } else {
      context.setAnswer('target_date_option', 'set_another_date')

      // Convert date to DD/MM/YYYY format for the date picker
      const day = derivedGoal.targetDate.getDate().toString().padStart(2, '0')
      const month = (derivedGoal.targetDate.getMonth() + 1).toString().padStart(2, '0')
      const year = derivedGoal.targetDate.getFullYear()
      context.setAnswer('custom_target_date', `${day}/${month}/${year}`)
    }
  }
}
