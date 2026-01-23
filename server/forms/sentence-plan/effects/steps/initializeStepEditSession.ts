import { SentencePlanContext, StepChangesStorage } from '../types'
import { decodeHtmlEntities } from '../../../../utils/decodeHtmlEntities'

/**
 * Initialize the step edit session
 *
 * Sets up the step changes in session for the dynamic form, keyed by goal UUID.
 * If the goal has existing steps from the API, those are loaded into session.
 * Otherwise, starts with one empty step for new goals.
 *
 * Restores field answers from session so saved values display on GET requests.
 */
export const initializeStepEditSession = () => async (context: SentencePlanContext) => {
  const session = context.getSession()
  const activeGoalUuid = context.getData('activeGoalUuid')
  const activeGoal = context.getData('activeGoal')

  if (!activeGoalUuid || !session) {
    return
  }

  // eslint-disable-next-line no-multi-assign
  const storage: StepChangesStorage = (session.stepChanges ??= {})

  // Get or initialize step changes for this goal
  if (!storage[activeGoalUuid]) {
    const stepsOriginal = context.getData('activeGoalStepsOriginal')

    if (stepsOriginal?.length > 0) {
      // Populate session with existing steps from API
      storage[activeGoalUuid] = {
        steps: stepsOriginal,
        toCreate: [],
        toUpdate: [],
        toDelete: [],
        collectionUuid: activeGoal?.stepsCollectionUuid,
      }
    } else {
      // Start with one empty step for new goals
      storage[activeGoalUuid] = {
        steps: [{ id: 'step_0', actor: '', description: '' }],
        toCreate: ['step_0'],
        toUpdate: [],
        toDelete: [],
      }
    }
  }

  const { steps } = storage[activeGoalUuid]
  context.setData('activeGoalStepsEdited', steps)

  // Restore field answers from session (GET requests only)
  // On POST requests, the form data should populate the answers instead
  // Decode HTML entities to prevent double-encoding when form engine renders the values
  steps.forEach((step, index) => {
    context.setAnswer(`step_actor_${index}`, step.actor)
    context.setAnswer(`step_description_${index}`, decodeHtmlEntities(step.description))
  })
}
