import { User } from '../../../../interfaces/user'
import { Commands } from '../../../../interfaces/aap-api/command'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { DerivedGoal } from '../types'

/**
 * Note types used in goal lifecycle events
 */
export type NoteType = 'READDED' | 'REMOVED' | 'ACHIEVED'

/**
 * Build the commands to add a note to a goal, for use inside a single command batch.
 *
 * When the goal has no NOTES collection yet, a CreateCollectionCommand is included first and
 * the note points at it with an "@N" placeholder, which the API swaps for the new collection's
 * UUID. This keeps the collection and the note in the same batch, so both save or neither does.
 *
 * Used by effects that add notes to a goal (remove, achieve, re-add, progress).
 *
 * @param params.activeGoal - The goal the note belongs to
 * @param params.batchIndex - Position in the batch where these commands will start
 * @param params.noteText - The note content (will be trimmed)
 * @param params.noteType - Optional type (READDED, REMOVED, ACHIEVED)
 * @param params.createdBy - Practitioner name
 * @param params.assessmentUuid - Assessment UUID
 * @param params.user - Current user
 */
export const buildAddNoteCommands = (params: {
  activeGoal: DerivedGoal
  batchIndex: number
  noteText: string
  noteType?: NoteType
  createdBy: string
  assessmentUuid: string
  user: User
}): Commands[] => {
  const { activeGoal, batchIndex, noteText, noteType, createdBy, assessmentUuid, user } = params

  const createCollectionCommands: Commands[] = activeGoal.notesCollectionUuid
    ? []
    : [
        {
          type: 'CreateCollectionCommand',
          name: 'NOTES',
          parentCollectionItemUuid: activeGoal.uuid,
          assessmentUuid,
          user,
        },
      ]

  return [
    ...createCollectionCommands,
    {
      type: 'AddCollectionItemCommand',
      collectionUuid: activeGoal.notesCollectionUuid ?? `@${batchIndex}`,
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
    },
  ]
}
