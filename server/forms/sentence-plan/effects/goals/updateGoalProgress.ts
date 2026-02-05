import { InternalServerError } from 'http-errors'
import { DerivedStep, SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import { getRequiredEffectContext, getPractitionerName } from './goalUtils'
import { getOrCreateNotesCollection, buildAddNoteCommand } from './noteUtils'

/**
 * Update goal progress - update step statuses and add progress note
 *
 * This effect:
 * 1. Updates the status of each step based on form fields (step_status_0, step_status_1, etc.)
 * 2. Adds a progress note if the user entered one
 * 3. Sets 'allStepsCompleted' boolean in context (used by confirm-if-achieved journey)
 *
 * Form fields used:
 * - step_status_{index}: Status for each step
 * - progress_notes: Optional progress note text
 */
export const updateGoalProgress = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'updateGoalProgress')
  const activeGoal = context.getData('activeGoal')

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required for updateGoalProgress')
  }

  const practitionerName = getPractitionerName(context, user)

  const steps: DerivedStep[] = activeGoal.steps ?? []
  const commands: Commands[] = []

  // 1. Update step statuses
  steps.forEach((step, index) => {
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
    const collectionUuid = await getOrCreateNotesCollection(deps, { activeGoal, assessmentUuid, user })

    commands.push(
      buildAddNoteCommand({
        collectionUuid,
        noteText: progressNotes,
        // No noteType for progress notes
        createdBy: practitionerName,
        assessmentUuid,
        user,
      }),
    )
  }

  // Execute all commands in a single batch
  if (commands.length > 0) {
    await deps.api.executeCommands(...commands)
  }

  // Check if all steps are now COMPLETED (using the new statuses from form submission)
  const allStepsCompleted =
    steps.length > 0 &&
    steps.every((_step, index) => {
      const newStatus = context.getAnswer(`step_status_${index}`)
      return newStatus === 'COMPLETED'
    })

  context.setData('allStepsCompleted', allStepsCompleted)
}
