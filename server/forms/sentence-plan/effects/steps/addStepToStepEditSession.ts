import { decodeHtmlEntities } from '../../../../utils/decodeHtmlEntities'
import { SentencePlanContext } from '../types'

/**
 * Add a new empty step to the step edit session
 * Saves current answer values to session before adding the new step.
 */
export const addStepToStepEditSession = () => async (context: SentencePlanContext) => {
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

  // Save current values to session (decode to prevent double-encoding)
  changes.steps.forEach((step, index) => {
    step.actor = context.getAnswer(`step_actor_${index}`) ?? step.actor
    step.description = decodeHtmlEntities(context.getAnswer(`step_description_${index}`)) || step.description
  })

  // Add new empty step
  const newStepId = `step_${Date.now()}`

  changes.steps.push({
    id: newStepId,
    actor: '',
    description: '',
  })

  // Track for creation on save
  changes.toCreate.push(newStepId)

  context.setData('activeGoalStepsEdited', changes.steps)

  // Set answers for all steps including the new one
  changes.steps.forEach((step, index) => {
    context.setAnswer(`step_actor_${index}`, step.actor)
    context.setAnswer(`step_description_${index}`, step.description)
  })
}
