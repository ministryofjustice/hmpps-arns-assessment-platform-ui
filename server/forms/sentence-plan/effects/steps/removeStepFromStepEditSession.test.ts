import { removeStepFromStepEditSession } from './removeStepFromStepEditSession'
import type { SentencePlanContext, SentencePlanSession, StepChanges, StepSession } from '../types'

interface MockContextOptions {
  session?: Partial<SentencePlanSession> | undefined
  activeGoalUuid?: string | undefined
  postAction?: string
  answers?: Record<string, string>
}

function createMockContext(options: MockContextOptions = {}) {
  const session: Partial<SentencePlanSession> = options.session ?? {}
  const answers: Record<string, string> = { ...options.answers }

  return {
    getSession: jest.fn(() => session),
    getData: jest.fn((key: string) => {
      if (key === 'activeGoalUuid') {
        return options.activeGoalUuid
      }

      return undefined
    }),
    getPostData: jest.fn((key: string) => {
      if (key === 'action') {
        return options.postAction ?? ''
      }

      return undefined
    }),
    getAnswer: jest.fn((key: string) => answers[key]),
    setAnswer: jest.fn((key: string, value: string) => {
      answers[key] = value
    }),
    setData: jest.fn(),
  } as unknown as SentencePlanContext
}

function createStepChanges(overrides: Partial<StepChanges> = {}): StepChanges {
  return {
    steps: [],
    toCreate: [],
    toUpdate: [],
    toDelete: [],
    ...overrides,
  }
}

function createStep(overrides: Partial<StepSession> = {}): StepSession {
  return {
    id: `step_${Date.now()}_${Math.random()}`,
    actor: '',
    description: '',
    ...overrides,
  }
}

describe('removeStepFromStepEditSession', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1000)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('early returns', () => {
    it('should return early when session is undefined', async () => {
      // Arrange
      const context = {
        getSession: jest.fn((): undefined => undefined),
        getData: jest.fn((): string => 'goal-1'),
        setData: jest.fn(),
      } as unknown as SentencePlanContext

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(context.setData).not.toHaveBeenCalled()
    })

    it('should return early when activeGoalUuid is undefined', async () => {
      // Arrange
      const context = createMockContext({
        session: {},
        activeGoalUuid: undefined,
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(context.setData).not.toHaveBeenCalled()
    })

    it('should return early when action index is NaN', async () => {
      // Arrange
      const steps = [createStep({ id: 'step-1', actor: 'Actor', description: 'Desc' })]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_abc',
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(context.setData).not.toHaveBeenCalled()
    })

    it('should return early when index is negative', async () => {
      // Arrange
      const steps = [createStep({ id: 'step-1' })]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_-1',
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(context.setData).not.toHaveBeenCalled()
    })

    it('should return early when index exceeds steps array length', async () => {
      // Arrange
      const steps = [createStep({ id: 'step-1' })]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_5',
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(context.setData).not.toHaveBeenCalled()
    })
  })

  describe('session initialisation', () => {
    it('should initialise stepChanges when it does not exist on session', async () => {
      // Arrange
      const session: Partial<SentencePlanSession> = {}
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(session.stepChanges).toBeDefined()
      expect(session.stepChanges!['goal-1']).toBeDefined()
    })

    it('should initialise goal entry when stepChanges exists but goal entry does not', async () => {
      // Arrange
      const session: Partial<SentencePlanSession> = { stepChanges: {} }
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(session.stepChanges!['goal-1']).toEqual({
        steps: [],
        toCreate: [],
        toUpdate: [],
        toDelete: [],
      })
    })
  })

  describe('index parsing', () => {
    it('should parse the step index from "remove_0" action string', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'Actor A', description: 'Desc A' }),
        createStep({ id: 'step-b', actor: 'Actor B', description: 'Desc B' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {
          step_actor_0: 'Actor A',
          step_description_0: 'Desc A',
          step_actor_1: 'Actor B',
          step_description_1: 'Desc B',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      // Step at index 0 (step-a) should have been removed, leaving only step-b
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.steps).toHaveLength(1)
      expect(changes.steps[0].id).toBe('step-b')
    })

    it('should parse the step index from "remove_2" action string', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'A', description: 'Da' }),
        createStep({ id: 'step-b', actor: 'B', description: 'Db' }),
        createStep({ id: 'step-c', actor: 'C', description: 'Dc' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_2',
        answers: {
          step_actor_0: 'A',
          step_description_0: 'Da',
          step_actor_1: 'B',
          step_description_1: 'Db',
          step_actor_2: 'C',
          step_description_2: 'Dc',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.steps).toHaveLength(2)
      expect(changes.steps[0].id).toBe('step-a')
      expect(changes.steps[1].id).toBe('step-b')
    })
  })

  describe('removing from multi-step session', () => {
    it('should remove the first step and keep the rest', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'A', description: 'Da' }),
        createStep({ id: 'step-b', actor: 'B', description: 'Db' }),
        createStep({ id: 'step-c', actor: 'C', description: 'Dc' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {
          step_actor_0: 'A',
          step_description_0: 'Da',
          step_actor_1: 'B',
          step_description_1: 'Db',
          step_actor_2: 'C',
          step_description_2: 'Dc',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.steps).toEqual([
        expect.objectContaining({ id: 'step-b', actor: 'B', description: 'Db' }),
        expect.objectContaining({ id: 'step-c', actor: 'C', description: 'Dc' }),
      ])
    })

    it('should remove the last step and keep the rest', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'A', description: 'Da' }),
        createStep({ id: 'step-b', actor: 'B', description: 'Db' }),
        createStep({ id: 'step-c', actor: 'C', description: 'Dc' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_2',
        answers: {
          step_actor_0: 'A',
          step_description_0: 'Da',
          step_actor_1: 'B',
          step_description_1: 'Db',
          step_actor_2: 'C',
          step_description_2: 'Dc',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.steps).toEqual([
        expect.objectContaining({ id: 'step-a', actor: 'A', description: 'Da' }),
        expect.objectContaining({ id: 'step-b', actor: 'B', description: 'Db' }),
      ])
    })

    it('should remove a middle step and keep the rest', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'A', description: 'Da' }),
        createStep({ id: 'step-b', actor: 'B', description: 'Db' }),
        createStep({ id: 'step-c', actor: 'C', description: 'Dc' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_1',
        answers: {
          step_actor_0: 'A',
          step_description_0: 'Da',
          step_actor_1: 'B',
          step_description_1: 'Db',
          step_actor_2: 'C',
          step_description_2: 'Dc',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.steps).toEqual([
        expect.objectContaining({ id: 'step-a', actor: 'A', description: 'Da' }),
        expect.objectContaining({ id: 'step-c', actor: 'C', description: 'Dc' }),
      ])
    })
  })

  describe('toDelete tracking', () => {
    it('should add existing step UUID to toDelete when removing from multi-step session', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'existing-uuid-1', actor: 'A', description: 'Da' }),
        createStep({ id: 'existing-uuid-2', actor: 'B', description: 'Db' }),
      ]
      const context = createMockContext({
        session: {
          stepChanges: { 'goal-1': createStepChanges({ steps }) },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {
          step_actor_0: 'A',
          step_description_0: 'Da',
          step_actor_1: 'B',
          step_description_1: 'Db',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.toDelete).toContain('existing-uuid-1')
    })

    it('should not add newly-created step to toDelete when removing from multi-step session', async () => {
      // Arrange
      const newStepId = 'new-step-123'
      const steps = [
        createStep({ id: newStepId, actor: 'New', description: 'New desc' }),
        createStep({ id: 'existing-uuid', actor: 'Existing', description: 'Existing desc' }),
      ]
      const context = createMockContext({
        session: {
          stepChanges: { 'goal-1': createStepChanges({ steps, toCreate: [newStepId] }) },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {
          step_actor_0: 'New',
          step_description_0: 'New desc',
          step_actor_1: 'Existing',
          step_description_1: 'Existing desc',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.toDelete).not.toContain(newStepId)
      expect(changes.toDelete).toHaveLength(0)
    })

    it('should add existing step UUID to toDelete when clearing the last step', async () => {
      // Arrange
      const steps = [createStep({ id: 'existing-uuid', actor: 'A', description: 'Da' })]
      const context = createMockContext({
        session: {
          stepChanges: { 'goal-1': createStepChanges({ steps }) },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: { step_actor_0: 'A', step_description_0: 'Da' },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.toDelete).toContain('existing-uuid')
    })

    it('should not add newly-created step to toDelete when clearing the last step', async () => {
      // Arrange
      const newStepId = 'new-step-456'
      const steps = [createStep({ id: newStepId, actor: 'New', description: 'New desc' })]
      const context = createMockContext({
        session: {
          stepChanges: { 'goal-1': createStepChanges({ steps, toCreate: [newStepId] }) },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: { step_actor_0: 'New', step_description_0: 'New desc' },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.toDelete).not.toContain(newStepId)
      expect(changes.toDelete).toHaveLength(0)
    })
  })

  describe('minimum step constraint', () => {
    it('should clear the step instead of removing when only one step remains', async () => {
      // Arrange
      const steps = [createStep({ id: 'only-step', actor: 'Actor', description: 'Description' })]
      const context = createMockContext({
        session: {
          stepChanges: { 'goal-1': createStepChanges({ steps }) },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: { step_actor_0: 'Actor', step_description_0: 'Description' },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.steps).toHaveLength(1)
      expect(changes.steps[0].actor).toBe('')
      expect(changes.steps[0].description).toBe('')
    })

    it('should generate a new step ID when clearing the last step', async () => {
      // Arrange
      const steps = [createStep({ id: 'old-step', actor: 'Actor', description: 'Desc' })]
      const context = createMockContext({
        session: {
          stepChanges: { 'goal-1': createStepChanges({ steps }) },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: { step_actor_0: 'Actor', step_description_0: 'Desc' },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.steps[0].id).toBe('step_1000')
      expect(changes.steps[0].id).not.toBe('old-step')
    })

    it('should add the new replacement step ID to toCreate', async () => {
      // Arrange
      const steps = [createStep({ id: 'old-step', actor: 'Actor', description: 'Desc' })]
      const context = createMockContext({
        session: {
          stepChanges: { 'goal-1': createStepChanges({ steps }) },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: { step_actor_0: 'Actor', step_description_0: 'Desc' },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.toCreate).toContain('step_1000')
    })
  })

  describe('saving current form values before modification', () => {
    it('should persist current answer values to step objects before removal', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'old-a', description: 'old-da' }),
        createStep({ id: 'step-b', actor: 'old-b', description: 'old-db' }),
        createStep({ id: 'step-c', actor: 'old-c', description: 'old-dc' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {
          step_actor_0: 'updated-a',
          step_description_0: 'updated-da',
          step_actor_1: 'updated-b',
          step_description_1: 'updated-db',
          step_actor_2: 'updated-c',
          step_description_2: 'updated-dc',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      // step-a was removed, step-b and step-c remain with updated values
      expect(changes.steps[0]).toEqual(
        expect.objectContaining({ id: 'step-b', actor: 'updated-b', description: 'updated-db' }),
      )
      expect(changes.steps[1]).toEqual(
        expect.objectContaining({ id: 'step-c', actor: 'updated-c', description: 'updated-dc' }),
      )
    })

    it('should keep original step values when answers are undefined', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'original-a', description: 'original-da' }),
        createStep({ id: 'step-b', actor: 'original-b', description: 'original-db' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {},
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      expect(changes.steps[0]).toEqual(
        expect.objectContaining({ id: 'step-b', actor: 'original-b', description: 'original-db' }),
      )
    })
  })

  describe('setData and setAnswer after removal', () => {
    it('should call setData with the remaining steps', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'A', description: 'Da' }),
        createStep({ id: 'step-b', actor: 'B', description: 'Db' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {
          step_actor_0: 'A',
          step_description_0: 'Da',
          step_actor_1: 'B',
          step_description_1: 'Db',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(context.setData).toHaveBeenCalledWith('activeGoalStepsEdited', [
        expect.objectContaining({ id: 'step-b', actor: 'B', description: 'Db' }),
      ])
    })

    it('should set answers with re-indexed step fields after removal', async () => {
      // Arrange
      const steps = [
        createStep({ id: 'step-a', actor: 'A', description: 'Da' }),
        createStep({ id: 'step-b', actor: 'B', description: 'Db' }),
        createStep({ id: 'step-c', actor: 'C', description: 'Dc' }),
      ]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {
          step_actor_0: 'A',
          step_description_0: 'Da',
          step_actor_1: 'B',
          step_description_1: 'Db',
          step_actor_2: 'C',
          step_description_2: 'Dc',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      // After removing index 0, step-b becomes index 0 and step-c becomes index 1
      expect(context.setAnswer).toHaveBeenCalledWith('step_actor_0', 'B')
      expect(context.setAnswer).toHaveBeenCalledWith('step_description_0', 'Db')
      expect(context.setAnswer).toHaveBeenCalledWith('step_actor_1', 'C')
      expect(context.setAnswer).toHaveBeenCalledWith('step_description_1', 'Dc')
    })

    it('should set empty answers when clearing the last step', async () => {
      // Arrange
      const steps = [createStep({ id: 'only-step', actor: 'Actor', description: 'Desc' })]
      const context = createMockContext({
        session: { stepChanges: { 'goal-1': createStepChanges({ steps }) } },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: { step_actor_0: 'Actor', step_description_0: 'Desc' },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      expect(context.setAnswer).toHaveBeenCalledWith('step_actor_0', '')
      expect(context.setAnswer).toHaveBeenCalledWith('step_description_0', '')
    })
  })

  describe('state consistency', () => {
    it('should keep steps array, toCreate, and toDelete in sync when removing an existing step', async () => {
      // Arrange
      const newStepId = 'new-step-1'
      const steps = [
        createStep({ id: 'existing-1', actor: 'E1', description: 'Ed1' }),
        createStep({ id: newStepId, actor: 'N1', description: 'Nd1' }),
        createStep({ id: 'existing-2', actor: 'E2', description: 'Ed2' }),
      ]
      const context = createMockContext({
        session: {
          stepChanges: {
            'goal-1': createStepChanges({
              steps,
              toCreate: [newStepId],
              toDelete: ['previously-deleted'],
            }),
          },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_0',
        answers: {
          step_actor_0: 'E1',
          step_description_0: 'Ed1',
          step_actor_1: 'N1',
          step_description_1: 'Nd1',
          step_actor_2: 'E2',
          step_description_2: 'Ed2',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      // existing-1 removed from steps, added to toDelete
      expect(changes.steps).toHaveLength(2)
      expect(changes.steps.map(s => s.id)).toEqual([newStepId, 'existing-2'])
      expect(changes.toCreate).toEqual([newStepId])
      expect(changes.toDelete).toEqual(['previously-deleted', 'existing-1'])
    })

    it('should keep steps array, toCreate, and toDelete in sync when removing a new step', async () => {
      // Arrange
      const newStepId = 'new-step-1'
      const steps = [
        createStep({ id: 'existing-1', actor: 'E1', description: 'Ed1' }),
        createStep({ id: newStepId, actor: 'N1', description: 'Nd1' }),
      ]
      const context = createMockContext({
        session: {
          stepChanges: {
            'goal-1': createStepChanges({
              steps,
              toCreate: [newStepId],
            }),
          },
        },
        activeGoalUuid: 'goal-1',
        postAction: 'remove_1',
        answers: {
          step_actor_0: 'E1',
          step_description_0: 'Ed1',
          step_actor_1: 'N1',
          step_description_1: 'Nd1',
        },
      })

      // Act
      await removeStepFromStepEditSession()(context)

      // Assert
      const changes = (context.getSession() as SentencePlanSession).stepChanges!['goal-1']

      // new-step-1 removed from steps, NOT added to toDelete (was never persisted)
      expect(changes.steps).toHaveLength(1)
      expect(changes.steps[0].id).toBe('existing-1')
      expect(changes.toDelete).toHaveLength(0)
      // toCreate still has the entry (the effect doesn't remove from toCreate)
      expect(changes.toCreate).toContain(newStepId)
    })
  })
})
