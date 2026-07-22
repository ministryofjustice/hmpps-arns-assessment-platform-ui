import { SentencePlanContext, StepChangesStorage, StepSession } from '../types'

/**
 * Initialize the step edit session
 *
 * Sets up the step changes in session for the dynamic form, keyed by goal UUID.
 * If the goal has existing steps from the API, those are loaded into session.
 * Otherwise, starts with one empty step for new goals.
 *
 * Saved steps are then updated with the latest values from the API, so a change
 * made on another page (e.g. a status set on "Update goal and steps") isn't shown
 * stale here. Unsaved new rows are left as they are.
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
        steps: [{ id: 'step_0', actor: '', description: '', status: '' }],
        toCreate: ['step_0'],
        toUpdate: [],
        toDelete: [],
      }
    }
  }

  const changes = storage[activeGoalUuid]

  // Update saved steps with the latest API values so changes made elsewhere
  // aren't shown stale. Unsaved new rows (toCreate) keep what the user typed.
  const newStepIds = new Set(changes.toCreate)
  const stepsById = new Map<string, StepSession>(
    (context.getData('activeGoalStepsOriginal') ?? []).map(step => [step.id, step]),
  )
  changes.steps = changes.steps.map(step => (newStepIds.has(step.id) ? step : (stepsById.get(step.id) ?? step)))

  const { steps } = changes
  context.setData('activeGoalStepsEdited', steps)

  // Restore field answers from session (GET requests only)
  // On POST requests, the form data should populate the answers instead
  steps.forEach((step, index) => {
    context.setAnswer(`step_actor_${index}`, step.actor)
    context.setAnswer(`step_description_${index}`, step.description)
    context.setAnswer(`step_status_${index}`, step.status)
  })
}
