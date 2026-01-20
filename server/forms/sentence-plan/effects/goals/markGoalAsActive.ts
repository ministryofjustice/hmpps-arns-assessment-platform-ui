import { InternalServerError } from 'http-errors'
import { DerivedGoal, SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import { calculateTargetDate, determineGoalStatus } from './goalUtils'

/**
 * Mark a goal as active (re-add a removed goal)
 *
 * This effect:
 * 1. Updates the goal status from 'REMOVED' to 'ACTIVE' or 'FUTURE'
 * 2. Updates the target date based on form selections
 * 3. Adds a re-add note if the user entered one (readd_note field)
 * 4. Moves the goal to the bottom of the list (highest collection index)
 *
 * This is the reverse of `markGoalAsRemoved` and is used via
 * the `confirm-readd-goal` flow to add a removed goal back into
 * the plan.
 *
 * Form fields used:
 * - readd_note: Required note about why the goal is being re-added
 * - can_start_now: 'yes' or 'no'
 * - target_date_option: Target date option (if can_start_now is 'yes')
 * - custom_target_date: Custom date (if set_another_date)
 */
export const markGoalAsActive = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')
  const activeGoal = context.getData('activeGoal')

  if (!user) {
    throw new InternalServerError('User is required to mark goal as active')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to mark goal as active')
  }

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required to mark as active')
  }

  // Get form answers
  const canStartNow = context.getAnswer('can_start_now') as string
  const targetDateOption = context.getAnswer('target_date_option') as string
  const customDate = context.getAnswer('custom_target_date') as string

  // Calculate target date and status
  const targetDate = calculateTargetDate(canStartNow, targetDateOption, customDate)
  const status = determineGoalStatus(canStartNow)

  const commands: Commands[] = []

  // 1. Update goal status and target date
  const propertiesToAdd: Record<string, unknown> = {
    status,
    status_date: new Date().toISOString(),
  }

  const answersToAdd: Record<string, unknown> = {}
  if (targetDate) {
    answersToAdd.target_date = targetDate
  }

  commands.push({
    type: 'UpdateCollectionItemPropertiesCommand',
    collectionItemUuid: activeGoal.uuid,
    added: wrapAll(propertiesToAdd),
    removed: [],
    assessmentUuid,
    user,
  })

  // Update answers if we have a target date
  if (Object.keys(answersToAdd).length > 0) {
    commands.push({
      type: 'UpdateCollectionItemAnswersCommand',
      collectionItemUuid: activeGoal.uuid,
      added: wrapAll(answersToAdd),
      removed: [],
      assessmentUuid,
      user,
    })
  }

  // 2. Add re-add note
  const readdNote = context.getAnswer('readd_note')
  if (readdNote && typeof readdNote === 'string' && readdNote.trim().length > 0) {
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

    // Add the note with type READDED
    commands.push({
      type: 'AddCollectionItemCommand',
      collectionUuid: collectionUuid!,
      properties: wrapAll({
        created_at: new Date().toISOString(),
        type: 'READDED',
      }),
      answers: wrapAll({
        note: readdNote.trim(),
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

  // Move goal to bottom of the list
  const goals = context.getData('goals') as DerivedGoal[]

  if (goals && goals.length > 1) {
    const maxCollectionIndex = Math.max(...goals.map(g => g.collectionIndex))

    // Only reorder if the goal isn't already at the bottom
    if (activeGoal.collectionIndex < maxCollectionIndex) {
      await deps.api.executeCommand({
        type: 'ReorderCollectionItemCommand',
        collectionItemUuid: activeGoal.uuid,
        index: maxCollectionIndex,
        assessmentUuid,
        user,
      })
    }
  }
}
