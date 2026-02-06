import { InternalServerError } from 'http-errors'
import { DerivedGoal, SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import { getRequiredEffectContext, calculateTargetDate, determineGoalStatus, getPractitionerName } from './goalUtils'
import { getOrCreateNotesCollection, buildAddNoteCommand } from './noteUtils'

/**
 * Re-add a removed goal back to the plan
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
export const readdGoalToPlan = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'readdGoalToPlan')
  const activeGoal = context.getData('activeGoal')

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required for readdGoalToPlan')
  }

  const practitionerName = getPractitionerName(context, user)

  // Get form answers
  const canStartNow = context.getAnswer('can_start_now') as string
  const targetDateOption = context.getAnswer('target_date_option') as string
  const customDate = context.getAnswer('custom_target_date') as string
  const readdNote = context.getAnswer('readd_note')

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
    timeline: {
      type: 'GOAL_READDED',
      data: {
        goalUuid: activeGoal.uuid,
        goalTitle: activeGoal.title,
        readdedBy: practitionerName,
        reason: (typeof readdNote === 'string' && readdNote.trim()) || undefined,
      },
    },
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

  // 2. Add re-add note if provided
  if (readdNote && typeof readdNote === 'string' && readdNote.trim().length > 0) {
    const collectionUuid = await getOrCreateNotesCollection(deps, { activeGoal, assessmentUuid, user })

    commands.push(
      buildAddNoteCommand({
        collectionUuid,
        noteText: readdNote,
        noteType: 'READDED',
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
