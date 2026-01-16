import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'

/**
 * Update goal progress - update step statuses and add progress note
 *
 * This effect:
 * 1. Updates the status of each step based on form fields (step_status_0, step_status_1, etc.)
 * 2. Adds a progress note if the user entered one
 * 3. sets 'allStepsCompleted' boolean variable in context (used in confirm-if-achieved journey)
 *
 * Form fields used:
 * - step_status_{index}: Status for each step
 * - progress_notes: Optional progress note text
 */
export const updateGoalProgress = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')
  const activeGoal = context.getData('activeGoal')

  if (!user) {
    throw new InternalServerError('User is required to update goal progress')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to update goal progress')
  }

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required to update progress')
  }

  const steps = activeGoal.steps ?? []
  const commands: Commands[] = []

  // 1. Update step statuses
  steps.forEach((step: any, index: number) => {
    const newStatus = context.getAnswer(`step_status_${index}`)

    // Only update if status has changed
    if (newStatus && newStatus !== step.status) {
      commands.push({
        type: 'UpdateCollectionItemAnswersCommand',
        collectionItemUuid: step.uuid,
        added: wrapAll({
          status: newStatus,
        }),
        removed: [],
        timeline: {
          type: 'STEP_UPDATED',
          data: {},
        },
        assessmentUuid,
        user,
      })

      // Update status_date property when status changes
      commands.push({
        type: 'UpdateCollectionItemPropertiesCommand',
        collectionItemUuid: step.uuid,
        added: wrapAll({
          status_date: new Date().toISOString(),
        }),
        removed: [],
        assessmentUuid,
        user,
      })
    }
  })

  // 2. Add progress note if provided
  const progressNotes = context.getAnswer('progress_notes')
  if (progressNotes && typeof progressNotes === 'string' && progressNotes.trim().length > 0) {
    // Find or create NOTES collection for the goal
    let collectionUuid = activeGoal.notesCollectionUuid

    if (!collectionUuid) {
      // Create the NOTES collection (goal doesn't have one yet)
      const createResult = await deps.api.executeCommand({
        type: 'CreateCollectionCommand',
        name: 'NOTES',
        parentCollectionItemUuid: activeGoal.uuid,
        assessmentUuid,
        user,
      })

      collectionUuid = createResult.collectionUuid
    }

    // Add the note
    commands.push({
      type: 'AddCollectionItemCommand',
      collectionUuid: collectionUuid!,
      properties: wrapAll({
        created_at: new Date().toISOString(),
      }),
      answers: wrapAll({
        note: progressNotes.trim(),
        created_by: user.name,
      }),
      timeline: {
        type: 'NOTE_ADDED',
        data: {},
      },
      assessmentUuid,
      user,
    })
  }

  // Execute all commands in a single batch
  if (commands.length > 0) {
    await deps.api.executeCommands(...commands)
  }

  // check if all steps are now COMPLETED (using the new statuses from form submission):
  const allStepsCompleted =
    steps.length > 0 &&
    steps.every((_step: any, index: number) => {
      const newStatus = context.getAnswer(`step_status_${index}`)
      return newStatus === 'COMPLETED'
    })

  context.setData('allStepsCompleted', allStepsCompleted)
}
