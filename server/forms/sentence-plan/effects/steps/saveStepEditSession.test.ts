import { saveStepEditSession } from './saveStepEditSession'
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
  stepsCollectionUuid: 'steps-collection-1',
} as DerivedGoal

interface MockContextOptions {
  session?: SentencePlanSession
  answers?: Record<string, string>
  data?: Record<string, unknown>
}

function createMockContext(options: MockContextOptions = {}) {
  const session = options.session ?? {}
  const answers = options.answers ?? {}
  const data: Record<string, unknown> = {
    assessmentUuid: 'assessment-1',
    activeGoalUuid: activeGoal.uuid,
    activeGoal,
    activeGoalStepsOriginal: [] as StepSession[],
    navigationReferrer: 'update-goal-steps',
    ...options.data,
  }

  return {
    getSession: jest.fn(() => session),
    getState: jest.fn((key: string) => (key === 'user' ? user : undefined)),
    getData: jest.fn((key: string) => data[key]),
    getAnswer: jest.fn((key: string) => answers[key]),
  } as unknown as SentencePlanContext
}

function createDeps() {
  return {
    api: {
      executeCommand: jest.fn().mockResolvedValue({ collectionUuid: 'created-steps-collection' }),
      executeCommands: jest.fn().mockResolvedValue([]),
    },
  } as unknown as SentencePlanEffectsDeps
}

function createStepChanges(overrides: Partial<StepChanges>): StepChanges {
  return {
    steps: [],
    toCreate: [],
    toUpdate: [],
    toDelete: [],
    collectionUuid: activeGoal.stepsCollectionUuid,
    ...overrides,
  }
}

function createStep(overrides: Partial<StepSession>): StepSession {
  return {
    id: 'step-1',
    actor: 'probation_practitioner',
    description: 'Contact housing services',
    ...overrides,
  }
}

function getExecutedCommands(deps: SentencePlanEffectsDeps) {
  return (deps.api.executeCommands as jest.Mock).mock.calls[0] ?? []
}

describe('saveStepEditSession', () => {
  it('should add a GOAL_UPDATED timeline event when an existing step is changed', async () => {
    const deps = createDeps()
    const session: SentencePlanSession = {
      practitionerDetails: { identifier: 'user-1', displayName: 'Jane Smith', authSource: 'HMPPS_AUTH' },
      stepChanges: {
        [activeGoal.uuid]: createStepChanges({
          steps: [createStep({ id: 'step-1' })],
        }),
      },
    }
    const context = createMockContext({
      session,
      data: {
        activeGoalStepsOriginal: [
          createStep({
            id: 'step-1',
            actor: 'probation_practitioner',
            description: 'Contact housing services',
          }),
        ],
      },
      answers: {
        step_actor_0: 'person_on_probation',
        step_description_0: 'Contact the housing officer',
      },
    })

    await saveStepEditSession(deps)(context)

    const commands = getExecutedCommands(deps)
    expect(commands).toContainEqual(
      expect.objectContaining({
        type: 'UpdateCollectionItemPropertiesCommand',
        collectionItemUuid: activeGoal.uuid,
        timeline: {
          type: 'GOAL_UPDATED',
          data: {
            goalUuid: activeGoal.uuid,
            goalTitle: activeGoal.title,
            updatedBy: 'Jane Smith',
          },
        },
      }),
    )
  })

  it('should add a GOAL_UPDATED timeline event when a new step is added to an existing goal', async () => {
    const deps = createDeps()
    const newStep = createStep({ id: 'step-new', actor: '', description: '' })
    const session: SentencePlanSession = {
      stepChanges: {
        [activeGoal.uuid]: createStepChanges({
          steps: [newStep],
          toCreate: [newStep.id],
        }),
      },
    }
    const context = createMockContext({
      session,
      answers: {
        step_actor_0: 'probation_practitioner',
        step_description_0: 'Book an appointment',
      },
    })

    await saveStepEditSession(deps)(context)

    const commands = getExecutedCommands(deps)
    expect(commands).toContainEqual(
      expect.objectContaining({
        type: 'UpdateCollectionItemPropertiesCommand',
        collectionItemUuid: activeGoal.uuid,
        timeline: expect.objectContaining({ type: 'GOAL_UPDATED' }),
      }),
    )
  })

  it('should add a GOAL_UPDATED timeline event when a step is removed', async () => {
    const deps = createDeps()
    const session: SentencePlanSession = {
      stepChanges: {
        [activeGoal.uuid]: createStepChanges({
          steps: [createStep({ id: 'step-2' })],
          toDelete: ['step-1'],
        }),
      },
    }
    const context = createMockContext({
      session,
      data: {
        activeGoalStepsOriginal: [createStep({ id: 'step-1' }), createStep({ id: 'step-2' })],
      },
      answers: {
        step_actor_0: 'probation_practitioner',
        step_description_0: 'Contact housing services',
      },
    })

    await saveStepEditSession(deps)(context)

    const commands = getExecutedCommands(deps)
    expect(commands).toContainEqual(
      expect.objectContaining({
        type: 'UpdateCollectionItemPropertiesCommand',
        collectionItemUuid: activeGoal.uuid,
        timeline: expect.objectContaining({ type: 'GOAL_UPDATED' }),
      }),
    )
  })

  it('should not add a GOAL_UPDATED timeline event when step values are unchanged', async () => {
    const deps = createDeps()
    const unchangedStep = createStep({ id: 'step-1' })
    const session: SentencePlanSession = {
      stepChanges: {
        [activeGoal.uuid]: createStepChanges({
          steps: [unchangedStep],
        }),
      },
    }
    const context = createMockContext({
      session,
      data: { activeGoalStepsOriginal: [unchangedStep] },
      answers: {
        step_actor_0: unchangedStep.actor,
        step_description_0: unchangedStep.description,
      },
    })

    await saveStepEditSession(deps)(context)

    const commands = getExecutedCommands(deps)
    expect(commands).not.toContainEqual(
      expect.objectContaining({
        timeline: expect.objectContaining({ type: 'GOAL_UPDATED' }),
      }),
    )
  })

  it('should not add a GOAL_UPDATED timeline event when saving steps for a newly-created goal', async () => {
    const deps = createDeps()
    const newStep = createStep({ id: 'step-new', actor: '', description: '' })
    const session: SentencePlanSession = {
      stepChanges: {
        [activeGoal.uuid]: createStepChanges({
          steps: [newStep],
          toCreate: [newStep.id],
        }),
      },
    }
    const context = createMockContext({
      session,
      data: { navigationReferrer: 'add-goal' },
      answers: {
        step_actor_0: 'probation_practitioner',
        step_description_0: 'Book an appointment',
      },
    })

    await saveStepEditSession(deps)(context)

    const commands = getExecutedCommands(deps)
    expect(commands).not.toContainEqual(
      expect.objectContaining({
        timeline: expect.objectContaining({ type: 'GOAL_UPDATED' }),
      }),
    )
  })
})
