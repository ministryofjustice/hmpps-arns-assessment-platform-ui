import { ThunkInvocationAdapter, ThunkResult } from '@form-engine/core/compilation/thunks/types'
import ThunkEvaluationContext from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import { StepRuntimePlan } from '@form-engine/core/compilation/StepRuntimePlanBuilder'
import { NodeId } from '@form-engine/core/types/engine.type'
import ReachabilityExecutor from './ReachabilityExecutor'
import { ReachabilityRuntimePlan, ReachabilityStepEntry } from '../../compilation/ReachabilityRuntimePlanBuilder'

const mockValidationExecutorExecute = jest.fn()

jest.mock('@form-engine/core/runtime/executors/ValidationExecutor', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      execute: (...args: unknown[]) => mockValidationExecutorExecute(...args),
    })),
  }
})

function createRuntimePlan(stepId: NodeId): StepRuntimePlan {
  return {
    stepId,
    accessAncestorIds: [stepId],
    actionTransitionIds: [],
    submitTransitionIds: [],
    fieldIteratorRootIds: [],
    validationIterateNodeIds: [],
    validationBlockIds: [],
    renderAncestorIds: [],
    renderStepId: stepId,
    isRenderSync: false,
    isAnswerPrepareSync: false,
  }
}

function createEntry(options: {
  stepId: NodeId
  path: string
  isEntryPoint?: boolean
  forwardOutcomeIds?: NodeId[]
  hasValidation?: boolean
}): ReachabilityStepEntry {
  return {
    stepId: options.stepId,
    path: options.path,
    isEntryPoint: options.isEntryPoint ?? false,
    stepRuntimePlan: createRuntimePlan(options.stepId),
    forwardOutcomeIds: options.forwardOutcomeIds ?? [],
    hasValidation: options.hasValidation ?? false,
  }
}

function successResult<T>(value: T): ThunkResult<T> {
  return { value, metadata: { source: 'test', timestamp: Date.now() } }
}

describe('ReachabilityExecutor', () => {
  let executor: ReachabilityExecutor
  let context: jest.Mocked<ThunkEvaluationContext>
  let invoker: jest.Mocked<ThunkInvocationAdapter>

  beforeEach(() => {
    executor = new ReachabilityExecutor()
    mockValidationExecutorExecute.mockReset()
    mockValidationExecutorExecute.mockResolvedValue({
      isValid: true,
      failures: [],
    })

    context = {
      global: {
        answers: {},
        data: {},
      },
    } as unknown as jest.Mocked<ThunkEvaluationContext>

    invoker = {
      invoke: jest.fn().mockResolvedValue(successResult(undefined)),
      invokeSync: jest.fn(),
    } as unknown as jest.Mocked<ThunkInvocationAdapter>
  })

  it('should seed reachability from all entry points', async () => {
    // Arrange
    const plan: ReachabilityRuntimePlan = {
      entries: [
        createEntry({ stepId: 'compile_ast:1', path: 'one', isEntryPoint: true }),
        createEntry({ stepId: 'compile_ast:2', path: 'two', isEntryPoint: true }),
        createEntry({ stepId: 'compile_ast:3', path: 'three' }),
      ],
    }

    // Act
    const result = await executor.execute(plan, invoker, context)

    // Assert
    expect(result.steps.find(step => step.stepId === 'compile_ast:1')?.isReachable).toBe(true)
    expect(result.steps.find(step => step.stepId === 'compile_ast:2')?.isReachable).toBe(true)
    expect(result.steps.find(step => step.stepId === 'compile_ast:3')?.isReachable).toBe(false)
  })

  it('should match internal redirects using canonical paths', async () => {
    // Arrange
    const plan: ReachabilityRuntimePlan = {
      entries: [
        createEntry({
          stepId: 'compile_ast:4',
          path: 'one',
          isEntryPoint: true,
          forwardOutcomeIds: ['compile_ast:5'],
        }),
        createEntry({ stepId: 'compile_ast:6', path: 'two' }),
      ],
    }

    invoker.invoke.mockImplementation(async nodeId => {
      if (nodeId === 'compile_ast:5') {
        return successResult('two?tab=current#focus')
      }

      return successResult(undefined)
    })

    // Act
    const result = await executor.execute(plan, invoker, context)

    // Assert
    expect(result.steps.find(step => step.stepId === 'compile_ast:6')?.isReachable).toBe(true)
  })

  it('should resolve the linear invalid predecessor as the redirect target', async () => {
    // Arrange
    const plan: ReachabilityRuntimePlan = {
      entries: [
        createEntry({
          stepId: 'compile_ast:7',
          path: 'one',
          isEntryPoint: true,
          forwardOutcomeIds: ['compile_ast:8'],
        }),
        createEntry({
          stepId: 'compile_ast:9',
          path: 'two',
          hasValidation: true,
          forwardOutcomeIds: ['compile_ast:10'],
        }),
        createEntry({ stepId: 'compile_ast:11', path: 'three' }),
      ],
    }

    invoker.invoke.mockImplementation(async nodeId => {
      if (nodeId === 'compile_ast:8') {
        return successResult('two')
      }

      if (nodeId === 'compile_ast:10') {
        return successResult('three')
      }

      return successResult(undefined)
    })

    mockValidationExecutorExecute.mockImplementation(async (runtimePlan: StepRuntimePlan) => {
      if (runtimePlan.stepId === 'compile_ast:9') {
        return { isValid: false, failures: [] }
      }

      return { isValid: true, failures: [] }
    })

    // Act
    const result = await executor.execute(plan, invoker, context)
    const redirectPath = executor.resolveRedirectPath(result, 'compile_ast:11')

    // Assert
    expect(result.steps.find(step => step.stepId === 'compile_ast:11')?.isReachable).toBe(false)
    expect(redirectPath).toBe('two')
  })

  it('should fall back to the first reachable entry point when there are multiple previous paths', async () => {
    // Arrange
    const plan: ReachabilityRuntimePlan = {
      entries: [
        createEntry({
          stepId: 'compile_ast:12',
          path: 'entry-a',
          isEntryPoint: true,
          forwardOutcomeIds: ['compile_ast:13'],
        }),
        createEntry({
          stepId: 'compile_ast:14',
          path: 'entry-b',
          isEntryPoint: true,
          forwardOutcomeIds: ['compile_ast:15'],
        }),
        createEntry({
          stepId: 'compile_ast:16',
          path: 'middle-a',
          hasValidation: true,
          forwardOutcomeIds: ['compile_ast:17'],
        }),
        createEntry({
          stepId: 'compile_ast:18',
          path: 'middle-b',
          hasValidation: true,
          forwardOutcomeIds: ['compile_ast:19'],
        }),
        createEntry({ stepId: 'compile_ast:20', path: 'target' }),
      ],
    }

    invoker.invoke.mockImplementation(async nodeId => {
      if (nodeId === 'compile_ast:13') {
        return successResult('middle-a')
      }

      if (nodeId === 'compile_ast:15') {
        return successResult('middle-b')
      }

      if (nodeId === 'compile_ast:17' || nodeId === 'compile_ast:19') {
        return successResult('target')
      }

      return successResult(undefined)
    })

    mockValidationExecutorExecute.mockImplementation(async (runtimePlan: StepRuntimePlan) => {
      if (runtimePlan.stepId === 'compile_ast:16' || runtimePlan.stepId === 'compile_ast:18') {
        return { isValid: false, failures: [] }
      }

      return { isValid: true, failures: [] }
    })

    // Act
    const result = await executor.execute(plan, invoker, context)
    const redirectPath = executor.resolveRedirectPath(result, 'compile_ast:20')

    // Assert
    expect(result.steps.find(step => step.stepId === 'compile_ast:20')?.isReachable).toBe(false)
    expect(redirectPath).toBe('entry-a')
  })

  it('should only evaluate validation for reachable steps', async () => {
    // Arrange
    const plan: ReachabilityRuntimePlan = {
      entries: [
        createEntry({
          stepId: 'compile_ast:21',
          path: 'entry',
          isEntryPoint: true,
          forwardOutcomeIds: ['compile_ast:22'],
        }),
        createEntry({
          stepId: 'compile_ast:23',
          path: 'reachable',
          hasValidation: true,
        }),
        createEntry({
          stepId: 'compile_ast:24',
          path: 'unreachable',
          hasValidation: true,
        }),
      ],
    }

    invoker.invoke.mockImplementation(async nodeId => {
      if (nodeId === 'compile_ast:22') {
        return successResult('reachable')
      }

      return successResult(undefined)
    })

    // Act
    await executor.execute(plan, invoker, context)

    // Assert
    expect(mockValidationExecutorExecute).toHaveBeenCalledTimes(1)
    expect(mockValidationExecutorExecute).toHaveBeenCalledWith(
      expect.objectContaining({ stepId: 'compile_ast:23' }),
      invoker,
      context,
    )
  })

  it('should stop once the target step is reachable without validating the target step itself', async () => {
    // Arrange
    const plan: ReachabilityRuntimePlan = {
      entries: [
        createEntry({
          stepId: 'compile_ast:25',
          path: 'entry',
          isEntryPoint: true,
          forwardOutcomeIds: ['compile_ast:26'],
        }),
        createEntry({
          stepId: 'compile_ast:27',
          path: 'middle',
          hasValidation: true,
          forwardOutcomeIds: ['compile_ast:28'],
        }),
        createEntry({
          stepId: 'compile_ast:29',
          path: 'target',
          hasValidation: true,
          forwardOutcomeIds: ['compile_ast:30'],
        }),
        createEntry({
          stepId: 'compile_ast:31',
          path: 'after-target',
          hasValidation: true,
        }),
      ],
    }

    invoker.invoke.mockImplementation(async nodeId => {
      if (nodeId === 'compile_ast:26') {
        return successResult('middle')
      }

      if (nodeId === 'compile_ast:28') {
        return successResult('target')
      }

      if (nodeId === 'compile_ast:30') {
        return successResult('after-target')
      }

      return successResult(undefined)
    })

    // Act
    const result = await executor.execute(plan, invoker, context, 'compile_ast:29')

    // Assert
    expect(result.steps.find(step => step.stepId === 'compile_ast:29')?.isReachable).toBe(true)
    expect(mockValidationExecutorExecute).toHaveBeenCalledTimes(1)
    expect(mockValidationExecutorExecute).toHaveBeenCalledWith(
      expect.objectContaining({ stepId: 'compile_ast:27' }),
      invoker,
      context,
    )
  })
})
