import { buildAddNoteCommands } from './noteUtils'
import type { DerivedGoal } from '../types'
import type { User } from '../../../../interfaces/user'

const user: User = {
  id: 'user-1',
  name: 'Fallback User',
  authSource: 'HMPPS_AUTH',
}

describe('noteUtils', () => {
  describe('buildAddNoteCommands()', () => {
    it('should add the note to the existing collection when the goal has a notes collection', () => {
      // Arrange
      const activeGoal = { uuid: 'goal-1', notesCollectionUuid: 'notes-collection-1' } as DerivedGoal

      // Act
      const commands = buildAddNoteCommands({
        activeGoal,
        batchIndex: 2,
        noteText: '  Moved into stable housing  ',
        noteType: 'ACHIEVED',
        createdBy: 'Jane Smith',
        assessmentUuid: 'assessment-1',
        user,
      })

      // Assert
      expect(commands).toEqual([
        expect.objectContaining({
          type: 'AddCollectionItemCommand',
          collectionUuid: 'notes-collection-1',
          answers: expect.objectContaining({
            note: expect.objectContaining({ value: 'Moved into stable housing' }),
          }),
        }),
      ])
    })

    it('should create the notes collection and point the note at it when the goal has no notes collection', () => {
      // Arrange
      const activeGoal = { uuid: 'goal-1' } as DerivedGoal

      // Act
      const commands = buildAddNoteCommands({
        activeGoal,
        batchIndex: 2,
        noteText: 'Moved into stable housing',
        createdBy: 'Jane Smith',
        assessmentUuid: 'assessment-1',
        user,
      })

      // Assert
      expect(commands).toEqual([
        expect.objectContaining({
          type: 'CreateCollectionCommand',
          name: 'NOTES',
          parentCollectionItemUuid: 'goal-1',
        }),
        expect.objectContaining({
          type: 'AddCollectionItemCommand',
          collectionUuid: '@2',
        }),
      ])
    })
  })
})
