import { ASTTestFactory } from '@form-engine/test-utils/ASTTestFactory'
import { JourneyASTNode, StepASTNode } from '@form-engine/core/types/structures.type'
import { NodeId, AstNodeId } from '@form-engine/core/types/engine.type'
import ThunkEvaluationContext from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import ThunkEvaluator from '@form-engine/core/compilation/thunks/ThunkEvaluator'
import { StepRequest, StepResponse } from '@form-engine/core/runtime/routes/types'
import ContextPreparer from './ContextPreparer'

function createStep(data?: Record<string, unknown>): StepASTNode {
  const builder = ASTTestFactory.step().withPath('/step').withTitle('Step')

  if (data) {
    builder.withProperty('data', data)
  }

  return builder.build()
}

function createJourney(data?: Record<string, unknown>): JourneyASTNode {
  const builder = ASTTestFactory.journey().withProperty('path', '/journey').withCode('j').withTitle('Journey')

  if (data) {
    builder.withProperty('data', data)
  }

  return builder.build()
}

function setupMocks(ancestors: (JourneyASTNode | StepASTNode)[]): {
  preparer: ContextPreparer
  evaluator: jest.Mocked<ThunkEvaluator>
  mockContext: jest.Mocked<ThunkEvaluationContext>
  request: StepRequest
  response: StepResponse
} {
  const ancestorIds = ancestors.map(a => a.id) as AstNodeId[]

  const mockContext = {
    metadataRegistry: {
      get: jest.fn().mockImplementation((nodeId: NodeId, key: string) => {
        if (key === 'attachedToParentNode') {
          const index = ancestorIds.indexOf(nodeId as AstNodeId)

          if (index > 0) {
            return ancestorIds[index - 1]
          }
        }

        return undefined
      }),
    },
    nodeRegistry: {
      get: jest.fn().mockImplementation((nodeId: NodeId) => {
        return ancestors.find(a => a.id === nodeId)
      }),
    },
    global: {
      answers: {},
      data: {},
    },
  } as unknown as jest.Mocked<ThunkEvaluationContext>

  const evaluator = {
    createContext: jest.fn().mockReturnValue(mockContext),
  } as unknown as jest.Mocked<ThunkEvaluator>

  const request = {} as StepRequest
  const response = {} as StepResponse
  const preparer = new ContextPreparer()

  return { preparer, evaluator, mockContext, request, response }
}

describe('ContextPreparer', () => {
  beforeEach(() => {
    ASTTestFactory.resetIds()
  })

  describe('prepare()', () => {
    it('should create context via evaluator and return it', () => {
      // Arrange
      const step = createStep()
      const { preparer, evaluator, mockContext, request, response } = setupMocks([step])

      // Act
      const result = preparer.prepare(step.id, evaluator, request, response)

      // Assert
      expect(evaluator.createContext).toHaveBeenCalledWith(request, response)
      expect(result).toBe(mockContext)
    })

    it('should not modify data when no ancestors have static data', () => {
      // Arrange
      const step = createStep()
      const { preparer, evaluator, mockContext, request, response } = setupMocks([step])

      // Act
      preparer.prepare(step.id, evaluator, request, response)

      // Assert
      expect(mockContext.global.data).toEqual({})
    })

    it('should merge journey static data into context', () => {
      // Arrange
      const journey = createJourney({ apiUrl: 'https://api.test', timeout: 5000 })
      const step = createStep()
      const { preparer, evaluator, mockContext, request, response } = setupMocks([journey, step])

      // Act
      preparer.prepare(step.id, evaluator, request, response)

      // Assert
      expect(mockContext.global.data).toEqual({ apiUrl: 'https://api.test', timeout: 5000 })
    })

    it('should merge all ancestors with inner overriding outer', () => {
      // Arrange
      const journey = createJourney({ env: 'production', apiUrl: 'https://journey-api' })
      const step = createStep({ apiUrl: 'https://step-api', stepKey: 'value' })
      const { preparer, evaluator, mockContext, request, response } = setupMocks([journey, step])

      // Act
      preparer.prepare(step.id, evaluator, request, response)

      // Assert
      expect(mockContext.global.data).toEqual({
        env: 'production',
        apiUrl: 'https://step-api',
        stepKey: 'value',
      })
    })

    it('should merge deeply nested journey hierarchy', () => {
      // Arrange
      const outerJourney = createJourney({ level: 'outer', shared: 'outer-value' })
      const innerJourney = createJourney({ shared: 'inner-value', innerKey: 'inner' })
      const step = createStep({ stepOnly: 'step' })
      const { preparer, evaluator, mockContext, request, response } = setupMocks([outerJourney, innerJourney, step])

      // Act
      preparer.prepare(step.id, evaluator, request, response)

      // Assert
      expect(mockContext.global.data).toEqual({
        level: 'outer',
        shared: 'inner-value',
        innerKey: 'inner',
        stepOnly: 'step',
      })
    })

    it('should skip ancestors without data property', () => {
      // Arrange
      const journey = createJourney({ journeyKey: 'value' })
      const stepWithoutData = createStep()
      const { preparer, evaluator, mockContext, request, response } = setupMocks([journey, stepWithoutData])

      // Act
      preparer.prepare(stepWithoutData.id, evaluator, request, response)

      // Assert
      expect(mockContext.global.data).toEqual({ journeyKey: 'value' })
    })
  })
})
