import { SentencePlanContext } from '../types'

/**
 * Remove or clear a step from the step edit session
 *
 * Reads action from POST data to get the index (e.g., "remove_0" -> 0)
 *
 * If only 1 step remains: clears its values instead of removing (ensures minimum 1 step)
 * For existing steps: adds UUID to toDelete bucket for API deletion on save
 * For new steps: just removes from array (never saved to API)
 */
export const removeStepFromStepEditSession = () => async (context: SentencePlanContext) => {
  const session = context.getSession()
  const activeGoalUuid = context.getData('activeGoalUuid')

  if (!session || !activeGoalUuid) {
    return
  }

  if (!session.stepChanges) {
    session.stepChanges = {}
  }

  if (!session.stepChanges[activeGoalUuid]) {
    session.stepChanges[activeGoalUuid] = { steps: [], toCreate: [], toUpdate: [], toDelete: [] }
  }

  const changes = session.stepChanges[activeGoalUuid]

  // Get action from POST data
  // Parse the index from action (e.g., "remove_0" -> 0)
  const indexStr = context.getPostData('action').replace('remove_', '')
  const index = parseInt(indexStr, 10)

  if (Number.isNaN(index) || index < 0 || index >= changes.steps.length) {
    return
  }

  // Save current form values to session before modifying array
  changes.steps.forEach((step, i) => {
    step.actor = context.getAnswer(`step_actor_${i}`) ?? step.actor
    step.description = context.getAnswer(`step_description_${i}`) ?? step.description
  })

  // If only 1 step, clear it instead of removing
  if (changes.steps.length <= 1) {
    const stepToClear = changes.steps[0]

    // If clearing an existing step (not in toCreate), track it for deletion
    if (!changes.toCreate.includes(stepToClear.id)) {
      changes.toDelete.push(stepToClear.id)
    }

    // Replace with a new empty step
    const newStepId = `step_${Date.now()}`
    changes.steps[0] = {
      id: newStepId,
      actor: '',
      description: '',
    }

    changes.toCreate.push(newStepId)
  } else {
    const stepToRemove = changes.steps[index]

    // If this is an existing step (not in toCreate), track it for deletion on save
    if (!changes.toCreate.includes(stepToRemove.id)) {
      changes.toDelete.push(stepToRemove.id)
    }

    // Remove from array (indices now match form fields)
    changes.steps.splice(index, 1)
  }

  context.setData('activeGoalStepsEdited', changes.steps)

  // Set answers for remaining steps
  changes.steps.forEach((step, i) => {
    context.setAnswer(`step_actor_${i}`, step.actor)
    context.setAnswer(`step_description_${i}`, step.description)
  })
}
