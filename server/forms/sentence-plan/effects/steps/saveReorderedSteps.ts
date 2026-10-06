import { SentencePlanContext, SentencePlanEffectsDeps, StepChangesStorage } from '../types'
import { Commands } from '../../../../interfaces/aap-api/command'
import { getPractitionerName, getRequiredEffectContext } from '../goals/goalUtils'
import { snapshotFromGoal } from '../goals/goalSnapshot'

// - applies the reordered steps draft and persists the new order to the API
// - only sends ReorderCollectionItemCommands as no content changes happen on reorder
export const saveReorderedSteps = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'saveReorderedSteps')
  const session = context.getSession()
  const activeGoalUuid = context.getData('activeGoalUuid')

  const storage: StepChangesStorage = session?.stepChanges ?? {}
  const goalChanges = storage[activeGoalUuid]

  if (!goalChanges) {
    return
  }

  const draft = goalChanges.reorderedStepsDraft

  if (!draft) {
    return
  }

  // Skip if the order hasn't changed
  const originalIds = goalChanges.steps.map(s => s.id)
  const orderChanged = draft.some((id, index) => id !== originalIds[index])

  if (!orderChanged) {
    delete goalChanges.reorderedStepsDraft

    return
  }

  // Apply the draft order to stepChanges.steps
  const byId = new Map(goalChanges.steps.map(s => [s.id, s]))
  const reorderedSteps = draft
    .map(id => byId.get(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined)

  const commands: Commands[] = reorderedSteps.map((step, index) => ({
    type: 'ReorderCollectionItemCommand' as const,
    collectionItemUuid: step.id,
    index,
    assessmentUuid,
    user,
  }))

  // For plan history entry:
  const activeGoal = context.getData('activeGoal')

  if (activeGoal?.uuid) {
    const postReorderSteps = reorderedSteps.map(step => ({
      actor: step.actor,
      description: step.description,
      status: step.status,
    }))

    commands.push({
      type: 'UpdateCollectionItemPropertiesCommand',
      collectionItemUuid: activeGoal.uuid,
      added: {},
      removed: [],
      timeline: {
        type: 'GOAL_UPDATED',
        data: {
          goalUuid: activeGoal.uuid,
          goalTitle: activeGoal.title,
          updatedBy: getPractitionerName(context, user),
          goalSnapshot: snapshotFromGoal(activeGoal, { steps: postReorderSteps }),
        },
      },
      assessmentUuid,
      user,
    })
  }

  if (commands.length) {
    await deps.api.executeCommands(...commands)
  }

  // Update session to reflect the saved order
  goalChanges.steps = reorderedSteps
  delete goalChanges.reorderedStepsDraft
}
