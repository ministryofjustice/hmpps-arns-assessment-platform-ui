import { wrapAll } from '../../../../data/aap-api/wrappers'
import { SentencePlanContext, SentencePlanEffectsDeps, StepChangesStorage, StepProperties } from '../types'
import { Commands } from '../../../../interfaces/aap-api/command'
import { getPractitionerName, getRequiredEffectContext } from '../goals/goalUtils'
import { snapshotFromGoal } from '../goals/goalSnapshot'

/**
 * Save the step edit session to the API
 */
export const saveStepEditSession = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'saveStepEditSession')
  const session = context.getSession()
  const activeGoalUuid = context.getData('activeGoalUuid')
  const activeGoal = context.getData('activeGoal')

  const storage: StepChangesStorage = session?.stepChanges ?? {}
  const { steps, toCreate, toDelete, collectionUuid } = storage[activeGoalUuid] ?? {
    steps: [],
    toCreate: [],
    toUpdate: [],
    toDelete: [],
  }

  // Get current form values for a step by index
  const getFormValues = (index: number) => ({
    actor: context.getAnswer(`step_actor_${index}`),
    description: context.getAnswer(`step_description_${index}`),
    status: context.getAnswer(`step_status_${index}`),
  })

  // Get original step values for change detection
  const stepsOriginal = context.getData('activeGoalStepsOriginal') ?? []

  // Partition steps into new and existing
  const newStepIds = new Set(toCreate)
  const newSteps: { index: number; id: string }[] = []
  const existingSteps: { index: number; id: string }[] = []

  steps.forEach((step, index) => {
    if (newStepIds.has(step.id)) {
      newSteps.push({ index, id: step.id })
    } else {
      existingSteps.push({ index, id: step.id })
    }
  })

  // Find existing steps that were modified (compare form values to original API values)
  const modifiedSteps = existingSteps.filter(({ index, id }) => {
    const current = getFormValues(index)
    const original = stepsOriginal.find(s => s.id === id)

    return current.actor !== original?.actor ||
      current.description !== original?.description ||
      current.status !== original?.status
  })

  const hasStepChanges = newSteps.length > 0 || modifiedSteps.length > 0 || toDelete.length > 0
  const isCreatingGoal = context.getData('navigationReferrer') === 'add-goal'

  // Find or create STEPS collection if we have new steps to add
  let stepsCollectionUuid = collectionUuid

  if (newSteps.length > 0 && !stepsCollectionUuid) {
    // Create the STEPS collection (goal doesn't have one yet)
    const createResult = await deps.api.executeCommand({
      type: 'CreateCollectionCommand',
      name: 'STEPS',
      parentCollectionItemUuid: activeGoalUuid,
      assessmentUuid,
      user,
    })

    stepsCollectionUuid = createResult.collectionUuid
  }

  // Build batch of all step commands
  const commands: Commands[] = []

  // 1. DELETE commands
  toDelete.forEach(stepId => {
    commands.push({
      type: 'RemoveCollectionItemCommand',
      collectionItemUuid: stepId,
      timeline: { type: 'STEP_REMOVED', data: {} },
      assessmentUuid,
      user,
    })
  })

  // 2. UPDATE commands
  modifiedSteps.forEach(({ id, index }) => {
    const values = getFormValues(index)
    const original = stepsOriginal.find(s => s.id === id)

    commands.push({
      type: 'UpdateCollectionItemAnswersCommand',
      collectionItemUuid: id,
      added: wrapAll({
        actor: values.actor,
        description: values.description,
        status: values.status,
      }),
      removed: [],
      timeline: { type: 'STEP_UPDATED', data: {} },
      assessmentUuid,
      user,
    })

    // Refresh status_date when the status itself changed
    if (values.status !== original?.status) {
      commands.push({
        type: 'UpdateCollectionItemPropertiesCommand',
        collectionItemUuid: id,
        added: wrapAll({
          status_date: new Date().toISOString(),
        }),
        removed: [],
        assessmentUuid,
        user,
      })
    }
  })

  // 3. CREATE commands
  newSteps.forEach(({ index }) => {
    const values = getFormValues(index)

    const properties: StepProperties = {
      status_date: new Date().toISOString(),
    }

    const answers = {
      status: values.status,
      actor: values.actor,
      description: values.description,
    }

    commands.push({
      type: 'AddCollectionItemCommand',
      collectionUuid: stepsCollectionUuid!,
      properties: wrapAll(properties),
      answers: wrapAll(answers),
      timeline: { type: 'STEP_ADDED', data: {} },
      assessmentUuid,
      user,
    })
  })

  // When saving inside the goal-create journey, flag the GOAL_UPDATED with
  // `isInitialStepAdd: true` so plan-history folds it into GOAL_CREATED rather
  // than rendering a separate "Goal updated" entry.
  if (hasStepChanges && activeGoal?.uuid) {
    const postEditSteps = steps.map((step, index) => {
      const values = getFormValues(index)
      return {
        actor: values.actor,
        description: values.description,
        status: values.status,
      }
    })

    const goalSnapshot = snapshotFromGoal(activeGoal, { steps: postEditSteps })

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
          goalSnapshot,
          ...(isCreatingGoal ? { isInitialStepAdd: true } : {}),
        },
      },
      assessmentUuid,
      user,
    })
  }

  // 4. REORDER commands
  existingSteps.forEach(({ id, index }) => {
    commands.push({
      type: 'ReorderCollectionItemCommand',
      collectionItemUuid: id,
      index,
      assessmentUuid,
      user,
    })
  })

  // Execute all commands in a single batch
  if (commands.length) {
    await deps.api.executeCommands(...commands)
  }

  // Clear session state for this goal after successful save
  if (activeGoalUuid && storage[activeGoalUuid]) {
    delete storage[activeGoalUuid]
  }

  // Flag whether every remaining step is now COMPLETED, so the add-steps page can
  // prompt the confirm-if-achieved page (read by Data('allStepsCompleted')).
  const allStepsCompleted =
    steps.length > 0 && steps.every((_step, index) => getFormValues(index).status === 'COMPLETED')

  context.setData('allStepsCompleted', allStepsCompleted)
}
