import { SentencePlanContext } from '../types'
import { resolveActiveGoalFromRequest, setActiveGoalData } from './goalUtils'

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
  const activeGoalResolution = resolveActiveGoalFromRequest(context)
  if (!activeGoalResolution) {
    return
  }
  const { activeGoal } = activeGoalResolution

  setActiveGoalData(context, activeGoalResolution)

  if (activeGoal.steps.length > 0) {
    const stepsOriginal = activeGoal.steps.map(step => ({
      id: step.uuid,
      actor: step.actor,
      description: step.description,
    }))

    context.setData('activeGoalStepsOriginal', stepsOriginal)
  }
}
