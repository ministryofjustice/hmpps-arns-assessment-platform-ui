import { initializeStepEditSession } from './initializeStepEditSession'
import type { SentencePlanContext, SentencePlanSession, StepChanges, StepSession } from '../types'

interface MockContextOptions {
  session?: Partial<SentencePlanSession> | undefined
  activeGoalUuid?: string | undefined
  activeGoal?: { stepsCollectionUuid?: string } | undefined
  stepsOriginal?: StepSession[] | undefined
}

function createMockContext(options: MockContextOptions = {}) {
  const session = options.session
  const answers: Record<string, string> = {}

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
    setData: jest.fn(),
    getAnswer: jest.fn((key: string) => answers[key]),
    setAnswer: jest.fn((key: string, value: string) => {
      answers[key] = value
    }),
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
    id: 'step-id',
    actor: '',
    description: '',
    status: '',
    ...overrides,
  }
}

describe('initializeStepEditSession', () => {
  describe('early returns', () => {
    it('should return early when activeGoalUuid is undefined', async () => {
      // Arrange
      const context = createMockContext({ session: {}, activeGoalUuid: undefined })

      // Act
      await initializeStepEditSession()(context)

      // Assert
      expect(context.setData).not.toHaveBeenCalled()
    })

    it('should return early when session is undefined', async () => {
      // Arrange
      const context = createMockContext({ session: undefined, activeGoalUuid: 'goal-1' })

      // Act
      await initializeStepEditSession()(context)

      // Assert
      expect(context.setData).not.toHaveBeenCalled()
    })
  })

  describe('first visit seeding', () => {
    it('should seed the session from the API steps when no entry exists', async () => {
      // Arrange
      const session: Partial<SentencePlanSession> = {}
      const stepsOriginal = [
        createStep({ id: 'existing-1', actor: 'PP', description: 'Do thing', status: 'IN_PROGRESS' }),
      ]
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        activeGoal: { stepsCollectionUuid: 'collection-1' },
        stepsOriginal,
      })

      // Act
      await initializeStepEditSession()(context)

      // Assert
      expect(session.stepChanges!['goal-1']).toEqual({
        steps: stepsOriginal,
        toCreate: [],
        toUpdate: [],
        toDelete: [],
        collectionUuid: 'collection-1',
      })
    })

    it('should seed a single empty step when the goal has no API steps', async () => {
      // Arrange
      const session: Partial<SentencePlanSession> = {}
      const context = createMockContext({
        session,
        activeGoalUuid: 'goal-1',
        stepsOriginal: [],
      })

      // Act
      await initializeStepEditSession()(context)

      // Assert
      expect(session.stepChanges!['goal-1']).toEqual({
        steps: [{ id: 'step_0', actor: '', description: '', status: '' }],
        toCreate: ['step_0'],
        toUpdate: [],
        toDelete: [],
      })
    })
  })

  describe('reconciling a reused session', () => {
    it('should refresh an existing step status from the latest API value', async () => {
      // Arrange
      // Session holds a stale status; the API now has the updated value.
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'existing-1', actor: 'PP', description: 'Find housing', status: 'IN_PROGRESS' })],
          }),
        },
      }
      const stepsOriginal = [
        createStep({ id: 'existing-1', actor: 'PP', description: 'Find housing', status: 'CANNOT_BE_DONE_YET' }),
      ]
      const context = createMockContext({ session, activeGoalUuid: 'goal-1', stepsOriginal })

      // Act
      await initializeStepEditSession()(context)

      // Assert
      expect(session.stepChanges!['goal-1'].steps[0].status).toBe('CANNOT_BE_DONE_YET')
      expect(context.setAnswer).toHaveBeenCalledWith('step_status_0', 'CANNOT_BE_DONE_YET')
    })

    it('should preserve in-progress new rows tracked in toCreate', async () => {
      // Arrange
      const newStep = createStep({ id: 'new-1', actor: 'Person', description: 'Half typed', status: '' })
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'existing-1', status: 'IN_PROGRESS' }), newStep],
            toCreate: ['new-1'],
          }),
        },
      }
      const stepsOriginal = [createStep({ id: 'existing-1', status: 'COMPLETED' })]
      const context = createMockContext({ session, activeGoalUuid: 'goal-1', stepsOriginal })

      // Act
      await initializeStepEditSession()(context)

      // Assert
      const { steps } = session.stepChanges!['goal-1']
      expect(steps).toHaveLength(2)
      expect(steps[0].status).toBe('COMPLETED') // existing row refreshed from API
      expect(steps[1]).toEqual(newStep) // new row untouched
    })

    it('should preserve row order when reconciling', async () => {
      // Arrange
      const session: Partial<SentencePlanSession> = {
        stepChanges: {
          'goal-1': createStepChanges({
            steps: [createStep({ id: 'b' }), createStep({ id: 'a' })],
          }),
        },
      }
      const stepsOriginal = [
        createStep({ id: 'a', status: 'NOT_STARTED' }),
        createStep({ id: 'b', status: 'COMPLETED' }),
      ]
      const context = createMockContext({ session, activeGoalUuid: 'goal-1', stepsOriginal })

      // Act
      await initializeStepEditSession()(context)

      // Assert
      // Session ordering (b, a) is kept; only values are refreshed from the API.
      const { steps } = session.stepChanges!['goal-1']
      expect(steps.map(step => step.id)).toEqual(['b', 'a'])
      expect(steps[0].status).toBe('COMPLETED')
      expect(steps[1].status).toBe('NOT_STARTED')
    })

  })

  describe('answer restoration', () => {
    it('should restore actor, description and status answers for each step', async () => {
      // Arrange
      const session: Partial<SentencePlanSession> = {}
      const stepsOriginal = [
        createStep({ id: 'existing-1', actor: 'PP', description: 'First', status: 'IN_PROGRESS' }),
        createStep({ id: 'existing-2', actor: 'Person', description: 'Second', status: 'COMPLETED' }),
      ]
      const context = createMockContext({ session, activeGoalUuid: 'goal-1', stepsOriginal })

      // Act
      await initializeStepEditSession()(context)

      // Assert
      expect(context.setData).toHaveBeenCalledWith('activeGoalStepsEdited', stepsOriginal)
      expect(context.setAnswer).toHaveBeenCalledWith('step_actor_0', 'PP')
      expect(context.setAnswer).toHaveBeenCalledWith('step_description_0', 'First')
      expect(context.setAnswer).toHaveBeenCalledWith('step_status_0', 'IN_PROGRESS')
      expect(context.setAnswer).toHaveBeenCalledWith('step_actor_1', 'Person')
      expect(context.setAnswer).toHaveBeenCalledWith('step_description_1', 'Second')
      expect(context.setAnswer).toHaveBeenCalledWith('step_status_1', 'COMPLETED')
    })
  })
})
