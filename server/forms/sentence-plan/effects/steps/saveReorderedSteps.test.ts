import { saveReorderedSteps } from './saveReorderedSteps'
import type {
  DerivedGoal,
  SentencePlanContext,
  SentencePlanEffectsDeps,
  SentencePlanSession,
  StepChanges,
  StepSession,
} from '../types'
import type { User } from '../../../../interfaces/user'

const user: User = {
  id: 'user-1',
  name: 'Fallback User',
  authSource: 'HMPPS_AUTH',
}

const activeGoal = {
  uuid: 'goal-1',
  title: 'Find stable accommodation',
  status: 'ACTIVE',
  areaOfNeed: 'accommodation',
  stepsCollectionUuid: 'steps-collection-1',
} as DerivedGoal

interface MockContextOptions {
  session?: SentencePlanSession
  data?: Record<string, unknown>
}

const createMockContext = (options: MockContextOptions = {}) => {
  const session = options.session ?? {}
  const data: Record<string, unknown> = {
    assessmentUuid: 'assessment-1',
    activeGoalUuid: activeGoal.uuid,
    activeGoal,
    ...options.data,
  }

  return {
    getSession: jest.fn(() => session),
    getState: jest.fn((key: string) => (key === 'user' ? user : undefined)),
    getData: jest.fn((key: string) => data[key]),
  } as unknown as SentencePlanContext
}

const createDeps = () => {
  return {
    api: {
      executeCommands: jest.fn().mockResolvedValue([]),
    },
  } as unknown as SentencePlanEffectsDeps
}

const createStepChanges = (overrides: Partial<StepChanges>): StepChanges => {
  return {
    steps: [],
    toCreate: [],
    toUpdate: [],
    toDelete: [],
    collectionUuid: activeGoal.stepsCollectionUuid,
    ...overrides,
  }
}

const createStep = (overrides: Partial<StepSession>): StepSession => {
  return {
    id: 'step-1',
    actor: 'probation_practitioner',
    description: 'Contact housing services',
    status: 'NOT_STARTED',
    ...overrides,
  }
}

const getExecutedCommands = (deps: SentencePlanEffectsDeps) => {
  return (deps.api.executeCommands as jest.Mock).mock.calls[0] ?? []
}

describe('saveReorderedSteps', () => {
  describe('early returns', () => {
    it('should return early when goalChanges is undefined', async () => {
      const deps = createDeps()
      const context = createMockContext({ session: {} })

      await saveReorderedSteps(deps)(context)

      expect(deps.api.executeCommands).not.toHaveBeenCalled()
    })

    it('should return early when no reorderedSTeps draft exists', async () => {
      const deps = createDeps()
      const session: SentencePlanSession = {
        stepChanges: {
          [activeGoal.uuid]: createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
          }),
        },
      }
      const context = createMockContext({ session })

      await saveReorderedSteps(deps)(context)

      expect(deps.api.executeCommands).not.toHaveBeenCalled()
    })

    it('should return early when reorderedSteps draft matches the original order', async () => {
      const deps = createDeps()
      const session: SentencePlanSession = {
        stepChanges: {
          [activeGoal.uuid]: createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
            reorderedStepsDraft: ['a', 'b'],
          }),
        },
      }
      const context = createMockContext({ session })

      await saveReorderedSteps(deps)(context)

      expect(deps.api.executeCommands).not.toHaveBeenCalled()
      expect(session.stepChanges[activeGoal.uuid].reorderedStepsDraft).toBeUndefined()
    })
  })

  describe('reorder commands', () => {
    it('should send ReorderCollectionItemCommand for each step in the new order', async () => {
      const deps = createDeps()
      const session: SentencePlanSession = {
        stepChanges: {
          [activeGoal.uuid]: createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' }), createStep({ id: 'c' })],
            reorderedStepsDraft: ['c', 'a', 'b'],
          }),
        },
      }
      const context = createMockContext({ session })

      await saveReorderedSteps(deps)(context)

      const commands = getExecutedCommands(deps)
      expect(commands).toContainEqual(
        expect.objectContaining({ type: 'ReorderCollectionItemCommand', collectionItemUuid: 'c', index: 0 }),
      )
      expect(commands).toContainEqual(
        expect.objectContaining({ type: 'ReorderCollectionItemCommand', collectionItemUuid: 'a', index: 1 }),
      )
      expect(commands).toContainEqual(
        expect.objectContaining({ type: 'ReorderCollectionItemCommand', collectionItemUuid: 'b', index: 2 }),
      )
    })
  })

  describe('plan history', () => {
    it('should add a GOAL_UPDATED timeline entry when order changes', async () => {
      const deps = createDeps()
      const session: SentencePlanSession = {
        practitionerDetails: { identifier: 'user-1', displayName: 'Jane Smith', authSource: 'HMPPS_AUTH' },
        stepChanges: {
          [activeGoal.uuid]: createStepChanges({
            steps: [createStep({ id: 'a', description: '1' }), createStep({ id: 'b', description: '2' })],
            reorderedStepsDraft: ['b', 'a'],
          }),
        },
      }
      const context = createMockContext({ session })

      await saveReorderedSteps(deps)(context)

      const commands = getExecutedCommands(deps)
      expect(commands).toContainEqual(
        expect.objectContaining({
          type: 'UpdateCollectionItemPropertiesCommand',
          collectionItemUuid: activeGoal.uuid,
          timeline: expect.objectContaining({
            type: 'GOAL_UPDATED',
            data: expect.objectContaining({
              goalUuid: activeGoal.uuid,
              goalTitle: activeGoal.title,
              updatedBy: 'Jane Smith',
            }),
          }),
        }),
      )
    })

    it('should snapshot steps in the reordered sequence', async () => {
      const deps = createDeps()
      const session: SentencePlanSession = {
        stepChanges: {
          [activeGoal.uuid]: createStepChanges({
            steps: [
              createStep({ id: 'a', actor: 'PP', description: '1', status: 'NOT_STARTED' }),
              createStep({ id: 'b', actor: 'Person', description: '2', status: 'COMPLETED' }),
            ],
            reorderedStepsDraft: ['b', 'a'],
          }),
        },
      }
      const context = createMockContext({ session })

      await saveReorderedSteps(deps)(context)

      const commands = getExecutedCommands(deps)
      expect(commands).toContainEqual(
        expect.objectContaining({
          timeline: expect.objectContaining({
            data: expect.objectContaining({
              goalSnapshot: expect.objectContaining({
                steps: [
                  { actor: 'Person', description: '2', status: 'COMPLETED' },
                  { actor: 'PP', description: '1', status: 'NOT_STARTED' },
                ],
              }),
            }),
          }),
        }),
      )
    })

    it('should not add a GOAL_UPDATED timeline entry when order is unchanged', async () => {
      const deps = createDeps()
      const session: SentencePlanSession = {
        stepChanges: {
          [activeGoal.uuid]: createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
            reorderedStepsDraft: ['a', 'b'],
          }),
        },
      }
      const context = createMockContext({ session })

      await saveReorderedSteps(deps)(context)

      expect(deps.api.executeCommands).not.toHaveBeenCalled()
    })
  })

  describe('session cleanup', () => {
    it('should update stepChanges.steps to the reordered sequence after save', async () => {
      const deps = createDeps()
      const stepA = createStep({ id: 'a', description: 'First' })
      const stepB = createStep({ id: 'b', description: 'Second' })
      const session: SentencePlanSession = {
        stepChanges: {
          [activeGoal.uuid]: createStepChanges({
            steps: [stepA, stepB],
            reorderedStepsDraft: ['b', 'a'],
          }),
        },
      }
      const context = createMockContext({ session })

      await saveReorderedSteps(deps)(context)

      const { steps } = session.stepChanges[activeGoal.uuid]
      expect(steps.map(step => step.id)).toEqual(['b', 'a'])
    })

    it('should delete the draft after save', async () => {
      const deps = createDeps()
      const session: SentencePlanSession = {
        stepChanges: {
          [activeGoal.uuid]: createStepChanges({
            steps: [createStep({ id: 'a' }), createStep({ id: 'b' })],
            reorderedStepsDraft: ['b', 'a'],
          }),
        },
      }
      const context = createMockContext({ session })

      await saveReorderedSteps(deps)(context)

      expect(session.stepChanges[activeGoal.uuid].reorderedStepsDraft).toBeUndefined()
    })
  })
})
