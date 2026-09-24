import { User } from '@ministryofjustice/hmpps-aap-sdk/types/authentication/User.type'
import { Commands } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentCommand.type'
import { wrapAll } from '../../assessmentValueWrappers'
import { DerivedGoal, SentencePlanEffectsDeps } from '../types'

/**
 * Note types used in goal lifecycle events
 */
export type NoteType = 'READDED' | 'REMOVED' | 'ACHIEVED'

/**
 * Get existing notes collection UUID or create one if it doesn't exist.
 *
 * Used by effects that need to add notes to a goal (remove, achieve, re-add, progress).
 */
export const getOrCreateNotesCollection = async (
  deps: SentencePlanEffectsDeps,
  params: {
    activeGoal: DerivedGoal
    assessmentUuid: string
    user: User
  },
): Promise<string> => {
  const { activeGoal, assessmentUuid, user } = params

  if (activeGoal.notesCollectionUuid) {
    return activeGoal.notesCollectionUuid
  }

  const createResult = await deps.api.executeCommand({
    type: 'CreateCollectionCommand',
    name: 'NOTES',
    parentCollectionItemUuid: activeGoal.uuid,
    assessmentUuid,
    user,
  })

  return createResult.collectionUuid
}

/**
 * Build a command to add a note to a goal's notes collection.
 *
 * @param params.collectionUuid - UUID of the NOTES collection
 * @param params.noteText - The note content (will be trimmed)
 * @param params.noteType - Optional type (READDED, REMOVED, ACHIEVED)
 * @param params.createdBy - Practitioner name
 * @param params.assessmentUuid - Assessment UUID
 * @param params.user - Current user
 */
export const buildAddNoteCommand = (params: {
  collectionUuid: string
  noteText: string
  noteType?: NoteType
  createdBy: string
  assessmentUuid: string
  user: User
}): Commands => {
  const { collectionUuid, noteText, noteType, createdBy, assessmentUuid, user } = params

  return {
    type: 'AddCollectionItemCommand',
    collectionUuid,
    properties: wrapAll({
      created_at: new Date().toISOString(),
      ...(noteType && { type: noteType }),
    }),
    answers: wrapAll({
      note: noteText.trim(),
      created_by: createdBy,
    }),
    timeline: {
      type: 'NOTE_ADDED',
      data: {},
    },
    assessmentUuid,
    user,
  }
}
