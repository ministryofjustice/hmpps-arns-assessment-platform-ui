import { AreaOfNeed, DerivedGoal, SentencePlanContext } from '../types'

/**
 * Set area of need data from the active goal
 *
 * Derives `currentAreaOfNeed` from the `activeGoal.areaOfNeed` slug.
 *
 * Used on pages that need the area for an existing goal (e.g., change-goal, add-steps)
 * where the area should come from the goal, not URL params.
 *
 * Must be called after an effect that sets up activeGoal (e.g., setActiveGoalContext).
 */
export const setAreaDataFromActiveGoal = () => async (context: SentencePlanContext) => {
  const activeGoal = context.getData('activeGoal') as DerivedGoal | undefined
  const areasOfNeed = context.getData('areasOfNeed') as AreaOfNeed[] | undefined

  if (!activeGoal || !areasOfNeed) {
    return
  }

  const currentAreaOfNeed = areasOfNeed.find(area => area.slug === activeGoal.areaOfNeed)
  context.setData('currentAreaOfNeed', currentAreaOfNeed)
}
