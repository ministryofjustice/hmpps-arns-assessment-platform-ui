import { SentencePlanContext, StepChangesStorage } from '../types'

/**
 * Initialize the step edit session
 *
 * Sets up the step changes in session for the dynamic form, keyed by goal UUID.
 * If the goal has existing steps from the API, those are loaded into session.
 * Otherwise, starts with one empty step for new goals.
 *
 * Note: Session stores values as-is (HTML-encoded from API or sanitized from POST).
 * The DecodeHtmlEntities formatter on the field handles decoding for display.
 * This prevents double-decoding when values pass through multiple times.
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
      // Keep values as-is (HTML-encoded) - the formatter handles decoding for display
      storage[activeGoalUuid] = {
        steps: stepsOriginal.map(step => ({
          ...step,
        })),
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

  // Set field answers from session for display
  // On POST requests, these may be overwritten by form data during action handling
  steps.forEach((step, index) => {
    context.setAnswer(`step_actor_${index}`, step.actor)
    context.setAnswer(`step_description_${index}`, step.description)
  })
}
