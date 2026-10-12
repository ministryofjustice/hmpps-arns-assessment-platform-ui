import { discardStepEditSession } from './discardStepEditSession'
import type { SentencePlanContext, SentencePlanSession, StepChanges } from '../types'

interface MockContextOptions {
  session?: Partial<SentencePlanSession> | undefined
  activeGoalUuid?: string | undefined
}

function createMockContext(options: MockContextOptions = {}) {
  return {
    getSession: jest.fn(() => options.session),
    getData: jest.fn((key: string) => {
      if (key === 'activeGoalUuid') {
        return options.activeGoalUuid
      }

      return undefined
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

describe('discardStepEditSession', () => {
  it('should remove the step changes for the active goal', async () => {
    // Arrange
    const session: Partial<SentencePlanSession> = {
      stepChanges: { 'goal-1': createStepChanges({ toDelete: ['existing-1'] }) },
    }
    const context = createMockContext({ session, activeGoalUuid: 'goal-1' })

    // Act
    await discardStepEditSession()(context)

    // Assert
    expect(session.stepChanges).toEqual({})
  })

  it('should keep the step changes for other goals', async () => {
    // Arrange
    const otherGoalChanges = createStepChanges({ toCreate: ['step_1'] })
    const session: Partial<SentencePlanSession> = {
      stepChanges: { 'goal-1': createStepChanges(), 'goal-2': otherGoalChanges },
    }
    const context = createMockContext({ session, activeGoalUuid: 'goal-1' })

    // Act
    await discardStepEditSession()(context)

    // Assert
    expect(session.stepChanges).toEqual({ 'goal-2': otherGoalChanges })
  })

  it('should do nothing when activeGoalUuid is undefined', async () => {
    // Arrange
    const goalChanges = createStepChanges()
    const session: Partial<SentencePlanSession> = { stepChanges: { 'goal-1': goalChanges } }
    const context = createMockContext({ session, activeGoalUuid: undefined })

    // Act
    await discardStepEditSession()(context)

    // Assert
    expect(session.stepChanges).toEqual({ 'goal-1': goalChanges })
  })

  it('should do nothing when the session has no step changes', async () => {
    // Arrange
    const session: Partial<SentencePlanSession> = {}
    const context = createMockContext({ session, activeGoalUuid: 'goal-1' })

    // Act
    await discardStepEditSession()(context)

    // Assert
    expect(session.stepChanges).toBeUndefined()
  })
})
