import { SentencePlanContext, StepChangesStorage } from '../types'

// - manages the step reorder session on the reorder-steps page
// - runs in onAccess so it handles every GET/POST request
// --- moveUp_/moveDown_: ensures stepChanges exists, updates the reorderedStepsDraft and rebuilds activeGoal.steps for display
// --- saveAndContinue: draft preserved for saveReorderedSteps in onSubmission
// --- on anything else (GET/cancel etc): discards any stale draft
export const reorderStepsInSession = () => async (context: SentencePlanContext) => {
  const session = context.getSession()
  const activeGoalUuid = context.getData('activeGoalUuid')
  if (!activeGoalUuid || !session) {
    return
  }

  const action = context.getPostData('action')
  const isMove = typeof action === 'string' && (action.startsWith('moveUp_') || action.startsWith('moveDown_'))

  // Save - keep the draft for saveReorderedSteps
  if (action === 'saveAndContinue') {
    return
  }

  // Discard any stale draft on non-move action
  if (!isMove) {
    if (session.stepChanges?.[activeGoalUuid]) {
      delete session.stepChanges[activeGoalUuid].reorderedStepsDraft
    }

    return
  }

  // -----------MOVE ACTION----------
  const activeGoal = context.getData('activeGoal')

  // Ensure stepChanges exists (covers entry from update-goal-steps where initializeStepEditSession hasn't run
  // eslint-disable-next-line no-multi-assign
  const storage: StepChangesStorage = (session.stepChanges ??= {})
  if (!storage[activeGoalUuid]) {
    const stepsOriginal = context.getData('activeGoalStepsOriginal')

    storage[activeGoalUuid] = {
      steps: stepsOriginal?.length > 0 ? stepsOriginal : [],
      toCreate: [],
      toUpdate: [],
      toDelete: [],
      collectionUuid: activeGoal?.stepsCollectionUuid,
    }
  }

  const goalChanges = storage[activeGoalUuid]
  const { steps } = goalChanges
  const index = parseInt(action.split('_')[1], 10)
  const currentIds = steps.map(s => s.id)
  const draft = goalChanges.reorderedStepsDraft ?? currentIds

  if (Number.isNaN(index) || index < 0 || index >= draft.length) {
    return
  }

  const targetIndex = action.startsWith('moveUp_') ? index - 1 : index + 1

  if (targetIndex < 0 || targetIndex >= draft.length) {
    return
  }

  const temp = draft[index]
  draft[index] = draft[targetIndex]
  draft[targetIndex] = temp

  goalChanges.reorderedStepsDraft = draft

  // Rebuild steps in the new order (after moveUp/Down was clicked) on reorder steps page
  if (activeGoal?.steps) {
    const stepsByUuid = new Map(activeGoal.steps.map(s => [s.uuid, s]))
    activeGoal.steps = draft
      .map(id => stepsByUuid.get(id))
      .filter((step): step is NonNullable<typeof step> => step !== undefined)
  }
}
