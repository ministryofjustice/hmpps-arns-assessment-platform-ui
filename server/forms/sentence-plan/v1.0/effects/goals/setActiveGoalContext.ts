import { SentencePlanContext } from '../types'

/**
 * Set the active goal context for editing
 *
 * Looks up the goal by UUID from the derived goals and sets up the
 * context data needed for step editing:
 * - activeGoal: The goal being edited
 * - activeGoalUuid: UUID of the goal being edited
 * - activeGoalStepsOriginal: Original steps from API (baseline for change detection)
 */
export const setActiveGoalContext = () => async (context: SentencePlanContext) => {
  const goals = context.getData('goals')
  const goalUuid = context.getRequestParam('uuid')

  if (!goalUuid || goalUuid === ':uuid') {
    return
  }

  const derivedGoal = goals?.find(g => g.uuid === goalUuid)

  if (!derivedGoal) {
    return
  }

  const activeGoal = {
    uuid: derivedGoal.uuid,
    title: derivedGoal.title,
    status: derivedGoal.status,
    areaOfNeed: derivedGoal.areaOfNeed,
    stepsCollectionUuid: derivedGoal.stepsCollectionUuid,
  }

  context.setData('activeGoal', activeGoal)
  context.setData('activeGoalUuid', goalUuid)

  if (derivedGoal.steps.length > 0) {
    const stepsOriginal = derivedGoal.steps.map(step => ({
      id: step.uuid,
      actor: step.actor,
      description: step.description,
    }))

    context.setData('activeGoalStepsOriginal', stepsOriginal)
  }
}
