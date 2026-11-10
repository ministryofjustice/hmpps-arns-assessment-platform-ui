import { reorderStepsInSession } from './reorderStepsInSession'
import type { DerivedGoal, SentencePlanContext, SentencePlanSession, StepChanges, StepSession } from '../types'

interface MockContextOptions {
  session?: Partial<SentencePlanSession> | undefined
  activeGoalUuid?: string | undefined
  activeGoal?: Partial<DerivedGoal> | undefined
  stepsOriginal?: StepSession[] | undefined
  action?: string | undefined
}

const createMockContext = (options: MockContextOptions = {}) => {
  const session = options.session

  return {
    getSession: jest.fn(() => session),
    getData: jest.fn((key: string) => {
      if (key === 'activeGoalUuid') {
        return options.activeGoalUuid
      }

      if (key === 'activeGoal') {
        return options.activeGoal
      }

      if (key === 'activeGoalStepsOriginal') {
        return options.stepsOriginal
      }

      return undefined
    }),
    getPostData: jest.fn((): string | undefined => options.action),
  } as unknown as SentencePlanContext
}

const createStepChanges = (overrides: Partial<StepChanges> = {}): StepChanges => {
  return {
    steps: [],
    toCreate: [],
    toUpdate: [],
    toDelete: [],
    ...overrides,
  }
}

const createStep = (overrides: Partial<StepSession> = {}): StepSession => {
  return {
    id: 'step-id',
    actor: '',
    description: '',
    status: '',
    ...overrides,
  }
}

describe('reorderStepsInSession', () => {
  describe('early returns', () => {
    it('should return early when activeGoalUuid is undefined', async () => {
      const session: Partial<SentencePlanSession> = {}
      const context = createMockContext({ session, activeGoalUuid: undefined })

      await reorderStepsInSession()(context)

      expect(session.stepChanges).toBeUndefined()
    })

    it('should return early when session is undefined', async () => {
      const context = createMockContext({ session: undefined, activeGoalUuid: 'goal-1' })

      await reorderStepsInSession()(context)

      expect(context.getData).not.toHaveBeenCalledWith('activeGoal')
    })
  })

  describe('draft cleanup', () => {
    it('should discard the draft on GET (no action)', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
            reorderedStepsDraft: ['b', 'a'],
          }),
        },
      }
      const context = createMockContext({ session, activeGoalUuid: 'goal-1' })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toBeUndefined()
    })

    it('should discard the draft on cancel', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
            reorderedStepsDraft: ['b', 'a'],
          }),
        },
      }
      const context = createMockContext({ session, activeGoalUuid: 'goal-1', action: 'cancel' })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toBeUndefined()
    })
  })

  describe('session initialisation', () => {
    it('should create stepChanges from API steps when none exists on move', async () => {
      const session: Partial<SentencePlanSession> = {}
      const stepsOriginal = [
        createStep({ id: 'a', actor: 'PP', description: '1', status: 'NOT_STARTED' }),
        createStep({ id: 'b', actor: 'Person', description: '2', status: 'IN_PROGRESS' }),
      ]
      const activeGoal: Partial<DerivedGoal> = { stepsCollectionUuid: 'collection-1' }
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        activeGoal,
        stepsOriginal,
        action: 'moveDown_0',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].steps).toEqual(stepsOriginal)
      expect(session.stepChanges['goal-1'].collectionUuid).toBe('collection-1')
    })

  })

  describe('move actions', () => {
    it('should swap steps when moving down', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' }), createStep({ id: 'c' })],
          }),
        },
      }
      const activeGoal = {
        steps: [
          { uuid: 'a', actor: 'PP' },
          { uuid: 'b', actor: 'Person' },
          { uuid: 'c', actor: 'PP' },
        ],
      } as DerivedGoal
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        activeGoal,
        action: 'moveDown_0',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toEqual(['b', 'a', 'c'])
    })

    it('should swap steps when moving up', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' }), createStep({ id: 'c' })],
          }),
        },
      }
      const activeGoal = {
        steps: [
          { uuid: 'a', actor: 'PP' },
          { uuid: 'b', actor: 'Person' },
          { uuid: 'c', actor: 'PP' },
        ],
      } as DerivedGoal
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        activeGoal,
        action: 'moveUp_2',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toEqual(['a', 'c', 'b'])
    })

    it('should accumulate multiple moves on the existing draft', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' }), createStep({ id: 'c' })],
            reorderedStepsDraft: ['c', 'a', 'b'],
          }),
        },
      }
      const activeGoal = {
        steps: [
          { uuid: 'c', actor: 'PP' },
          { uuid: 'a', actor: 'Person' },
          { uuid: 'b', actor: 'PP' },
        ],
      } as DerivedGoal
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        activeGoal,
        action: 'moveDown_0',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toEqual(['a', 'c', 'b'])
    })

    it('should not move when first step is moved up', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
          }),
        },
      }
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        action: 'moveUp_0',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toBeUndefined()
    })

    it('should not move when last step is moved down', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
          }),
        },
      }
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        action: 'moveDown_1',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toBeUndefined()
    })

    it('should not move when index is out of bounds', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
          }),
        },
      }
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        action: 'moveUp_5',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toBeUndefined()
    })

    it('should not move when index is not a number', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
          }),
        },
      }
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        action: 'moveUp_abc',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].reorderedStepsDraft).toBeUndefined()
    })

    it('should rebuild activeGoal.steps in the draft order for display', async () => {
      const stepA = { uuid: 'a', actor: 'PP', description: 'First', status: 'NOT_STARTED' }
      const stepB = { uuid: 'b', actor: 'Person', description: 'Second', status: 'IN_PROGRESS' }
      const activeGoal = { steps: [stepA, stepB] } as DerivedGoal
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
          }),
        },
      }
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        activeGoal,
        action: 'moveDown_0',
      })

      await reorderStepsInSession()(context)

      expect(activeGoal.steps.map(step => step.uuid)).toEqual(['b', 'a'])
    })

    it('should not mutate stepChanges.steps during a move', async () => {
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' }), createStep({ id: 'c' })],
          }),
        },
      }
      const activeGoal = {
        steps: [{ uuid: 'a' }, { uuid: 'b' }, { uuid: 'c' }],
      } as DerivedGoal
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        activeGoal,
        action: 'moveDown_0',
      })

      await reorderStepsInSession()(context)

      expect(session.stepChanges['goal-1'].steps.map(s => s.id)).toEqual(['a', 'b', 'c'])
    })
  })
})
