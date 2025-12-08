import { ExpressionType } from '@form-engine/form/types/enums'
import AnswerLocalHandler from '@form-engine/core/ast/thunks/handlers/pseudo-nodes/AnswerLocalHandler'
import {
  createMockInvoker,
  createMockInvokerWithError,
  createSequentialMockInvoker,
  createMockContext,
} from '@form-engine/test-utils/thunkTestHelpers'
import { ASTTestFactory } from '@form-engine/test-utils/ASTTestFactory'
import { ASTNode, NodeId } from '@form-engine/core/types/engine.type'
import { PseudoNode } from '@form-engine/core/types/pseudoNodes.type'

describe('AnswerLocalHandler', () => {
  beforeEach(() => {
    ASTTestFactory.resetIds()
  })

  describe('evaluate()', () => {
    it('should use formatPipeline result when formatPipeline exists', async () => {
      // Arrange
      const formatPipelineNode = ASTTestFactory.expression(ExpressionType.PIPELINE).build()
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('email')
        .withProperty('formatPipeline', formatPipelineNode)
        .build()
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('email', fieldNode.id)
      const mockInvoker = createMockInvoker({ defaultValue: 'user@example.com' })
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockContext = createMockContext({
        mockNodes: new Map([[fieldNode.id, fieldNode]]),
        mockRequest: { post: { email: 'raw-value' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('user@example.com')
      expect(result.error).toBeUndefined()
      expect(mockContext.global.answers.email).toEqual({
        current: 'user@example.com',
        mutations: [{ value: 'user@example.com', source: 'processed' }],
      })
      expect(mockInvoker.invoke).toHaveBeenCalledWith(formatPipelineNode.id, mockContext)
    })

    it('should fall back to POST when formatPipeline returns undefined', async () => {
      // Arrange
      const formatPipelineNode = ASTTestFactory.expression(ExpressionType.PIPELINE).build()
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('email')
        .withProperty('formatPipeline', formatPipelineNode)
        .build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('email')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('email', fieldNode.id)
      const mockInvoker = createSequentialMockInvoker([undefined, 'raw@example.com'])
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        mockRequest: { post: { email: 'raw@example.com' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('raw@example.com')
      expect(mockContext.global.answers.email).toEqual({
        current: 'raw@example.com',
        mutations: [{ value: 'raw@example.com', source: 'post' }],
      })
    })

    it('should use raw POST value when no formatPipeline exists', async () => {
      // Arrange
      const fieldNode = ASTTestFactory.block('TextInput', 'field').withCode('name').build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('name')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('name', fieldNode.id)
      const mockInvoker = createMockInvoker({ defaultValue: 'John Doe' })
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        mockRequest: { post: { name: 'John Doe' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('John Doe')
      expect(mockContext.global.answers.name).toEqual({
        current: 'John Doe',
        mutations: [{ value: 'John Doe', source: 'post' }],
      })
      expect(mockInvoker.invoke).toHaveBeenCalledWith(postPseudoNode.id, mockContext)
    })

    it('should fall back to defaultValue when POST is undefined', async () => {
      // Arrange
      const defaultValueNode = ASTTestFactory.expression(ExpressionType.REFERENCE).build()
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('country')
        .withProperty('defaultValue', defaultValueNode)
        .build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('country')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('country', fieldNode.id)
      const mockInvoker = createSequentialMockInvoker([undefined, 'UK'])
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        mockRequest: { post: { country: '' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('UK')
      expect(mockContext.global.answers.country).toEqual({
        current: 'UK',
        mutations: [{ value: 'UK', source: 'default' }],
      })
      expect(mockInvoker.invoke).toHaveBeenCalledWith(defaultValueNode.id, mockContext)
    })

    it('should use literal defaultValue when defaultValue is a literal', async () => {
      // Arrange
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('status')
        .withProperty('defaultValue', 'pending')
        .build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('status')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('status', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockInvoker = createMockInvoker({ defaultValue: undefined })
      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('pending')
      expect(mockContext.global.answers.status).toEqual({
        current: 'pending',
        mutations: [{ value: 'pending', source: 'default' }],
      })
    })

    it('should return undefined and store undefined in answers when all sources return undefined', async () => {
      // Arrange
      const fieldNode = ASTTestFactory.block('TextInput', 'field').withCode('optional').build()
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('optional', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockInvoker = createMockInvoker()
      const mockContext = createMockContext({
        mockNodes: new Map([[fieldNode.id, fieldNode]]),
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBeUndefined()
      expect(mockContext.global.answers.optional).toEqual({
        current: undefined,
        mutations: [{ value: undefined, source: 'default' }],
      })
    })

    it('should preserve existing answer value from onLoad effects when no POST or defaultValue', async () => {
      // Arrange
      const fieldNode = ASTTestFactory.block('TextInput', 'field').withCode('preloaded').build()
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('preloaded', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockInvoker = createMockInvoker()
      const mockContext = createMockContext({
        mockNodes: new Map([[fieldNode.id, fieldNode]]),
        mockAnswers: { preloaded: 'value-from-api' },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('value-from-api')
      // History unchanged - still has original load mutation
      expect(mockContext.global.answers.preloaded).toEqual({
        current: 'value-from-api',
        mutations: [{ value: 'value-from-api', source: 'load' }],
      })
    })

    it('should use existing answer over defaultValue when both exist', async () => {
      // Arrange - field with defaultValue but also existing answer from API
      const defaultValueNode = ASTTestFactory.expression(ExpressionType.REFERENCE).build()
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('address')
        .withProperty('defaultValue', defaultValueNode)
        .build()
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('address', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)

      // DefaultValue would return empty string, but we have existing answer
      const mockInvoker = createMockInvoker({ defaultValue: '' })
      const mockContext = createMockContext({
        mockNodes: new Map([[fieldNode.id, fieldNode]]),
        mockAnswers: { address: '123 Main Street' },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert - existing answer should take precedence over defaultValue
      expect(result.value).toBe('123 Main Street')
      // History unchanged - still has original load mutation
      expect(mockContext.global.answers.address).toEqual({
        current: '123 Main Street',
        mutations: [{ value: '123 Main Street', source: 'load' }],
      })
      // defaultValue should NOT have been invoked
      expect(mockInvoker.invoke).not.toHaveBeenCalled()
    })

    it('should fall back to POST when formatPipeline returns error', async () => {
      // Arrange
      const formatPipelineNode = ASTTestFactory.expression(ExpressionType.PIPELINE).build()
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('email')
        .withProperty('formatPipeline', formatPipelineNode)
        .build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('email')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('email', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)

      const mockInvoker = createMockInvoker()
      mockInvoker.invoke
        .mockResolvedValueOnce({
          error: {
            type: 'EVALUATION_FAILED',
            nodeId: formatPipelineNode.id,
            message: 'Pipeline evaluation failed',
          },
          metadata: { source: 'formatPipeline', timestamp: Date.now() },
        })
        .mockResolvedValueOnce({
          value: 'fallback@example.com',
          metadata: { source: 'POST', timestamp: Date.now() },
        })

      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        mockRequest: { post: { email: 'fallback@example.com' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('fallback@example.com')
      expect(result.error).toBeUndefined()
      expect(mockContext.global.answers.email).toEqual({
        current: 'fallback@example.com',
        mutations: [{ value: 'fallback@example.com', source: 'post' }],
      })
    })

    it('should fall back to defaultValue when POST returns error', async () => {
      // Arrange
      const defaultValueNode = ASTTestFactory.expression(ExpressionType.REFERENCE).build()
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('country')
        .withProperty('defaultValue', defaultValueNode)
        .build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('country')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('country', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)

      const mockInvoker = createMockInvoker()
      mockInvoker.invoke
        .mockResolvedValueOnce({
          error: {
            type: 'EVALUATION_FAILED',
            nodeId: postPseudoNode.id,
            message: 'POST access failed',
          },
          metadata: { source: 'POST', timestamp: Date.now() },
        })
        .mockResolvedValueOnce({
          value: 'UK',
          metadata: { source: 'defaultValue', timestamp: Date.now() },
        })

      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        mockRequest: { post: { country: 'any' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('UK')
      expect(result.error).toBeUndefined()
      expect(mockContext.global.answers.country).toEqual({
        current: 'UK',
        mutations: [{ value: 'UK', source: 'default' }],
      })
    })

    it('should fall back through all steps when formatPipeline and POST both return errors', async () => {
      // Arrange
      const formatPipelineNode = ASTTestFactory.expression(ExpressionType.PIPELINE).build()
      const defaultValueNode = ASTTestFactory.expression(ExpressionType.REFERENCE).build()
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('status')
        .withProperty('formatPipeline', formatPipelineNode)
        .withProperty('defaultValue', defaultValueNode)
        .build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('status')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('status', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)

      const mockInvoker = createMockInvoker()
      mockInvoker.invoke
        .mockResolvedValueOnce({
          error: {
            type: 'EVALUATION_FAILED',
            nodeId: formatPipelineNode.id,
            message: 'Pipeline failed',
          },
          metadata: { source: 'formatPipeline', timestamp: Date.now() },
        })
        .mockResolvedValueOnce({
          error: {
            type: 'EVALUATION_FAILED',
            nodeId: postPseudoNode.id,
            message: 'POST failed',
          },
          metadata: { source: 'POST', timestamp: Date.now() },
        })
        .mockResolvedValueOnce({
          value: 'default-status',
          metadata: { source: 'defaultValue', timestamp: Date.now() },
        })

      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        mockRequest: { post: { status: 'any' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBe('default-status')
      expect(result.error).toBeUndefined()
      expect(mockContext.global.answers.status).toEqual({
        current: 'default-status',
        mutations: [{ value: 'default-status', source: 'default' }],
      })
    })

    it('should return undefined when all steps return errors', async () => {
      // Arrange
      const formatPipelineNode = ASTTestFactory.expression(ExpressionType.PIPELINE).build()
      const defaultValueNode = ASTTestFactory.expression(ExpressionType.REFERENCE).build()
      const fieldNode = ASTTestFactory.block('TextInput', 'field')
        .withCode('failing')
        .withProperty('formatPipeline', formatPipelineNode)
        .withProperty('defaultValue', defaultValueNode)
        .build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('failing')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('failing', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockInvoker = createMockInvokerWithError()
      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        mockRequest: { post: { failing: 'any' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.value).toBeUndefined()
      expect(result.error).toBeUndefined()
      expect(mockContext.global.answers.failing).toEqual({
        current: undefined,
        mutations: [{ value: undefined, source: 'default' }],
      })
    })

    it('should return error result when field node is not found', async () => {
      // Arrange
      const missingFieldNodeId = ASTTestFactory.getId()
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('missing', missingFieldNodeId)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)
      const mockInvoker = createMockInvoker()
      const mockContext = createMockContext()
      mockContext.nodeRegistry.get = jest.fn().mockReturnValue(undefined)

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert
      expect(result.error).toBeDefined()
      expect(result.error?.type).toBe('LOOKUP_FAILED')
      expect(result.error?.message).toContain(`Node "${missingFieldNodeId}" not found`)
      expect(result.value).toBeUndefined()
    })

    it('should protect action-set answers from POST override', async () => {
      // Arrange - simulating postcode lookup scenario
      // An action effect has set 'town' to 'Birmingham' with source 'action'
      // POST data has empty string for 'town' (user didn't type anything)
      const fieldNode = ASTTestFactory.block('TextInput', 'field').withCode('town').build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('town')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('town', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)

      // POST would return empty string, but we have action-set answer
      const mockInvoker = createMockInvoker({ defaultValue: '' })
      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        // Simulating answer set by onAction effect (e.g., postcode lookup)
        mockAnswers: {
          town: {
            current: 'Birmingham',
            mutations: [{ value: 'Birmingham', source: 'action' }],
          },
        },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert - action-set answer is protected, POST is NOT invoked
      expect(result.value).toBe('Birmingham')
      expect(mockContext.global.answers.town).toEqual({
        current: 'Birmingham',
        mutations: [{ value: 'Birmingham', source: 'action' }],
      })
      // POST handler should NOT have been called because action takes precedence
      expect(mockInvoker.invoke).not.toHaveBeenCalled()
    })

    it('should allow POST to override load-set answers', async () => {
      // Arrange - user editing a previously saved value
      const fieldNode = ASTTestFactory.block('TextInput', 'field').withCode('town').build()
      const postPseudoNode = ASTTestFactory.postPseudoNode('town')
      const pseudoNode = ASTTestFactory.answerLocalPseudoNode('town', fieldNode.id)
      const handler = new AnswerLocalHandler(pseudoNode.id, pseudoNode)

      // POST returns new value from user
      const mockInvoker = createMockInvoker({ defaultValue: 'Manchester' })
      const mockContext = createMockContext({
        mockNodes: new Map<NodeId, ASTNode | PseudoNode>([
          [fieldNode.id, fieldNode],
          [postPseudoNode.id, postPseudoNode],
        ]),
        // Previously loaded from API with source 'load'
        mockAnswers: { town: 'London' },
        mockRequest: { post: { town: 'Manchester' } },
      })

      // Act
      const result = await handler.evaluate(mockContext, mockInvoker)

      // Assert - load-set answer CAN be overridden by POST, mutation appended
      expect(result.value).toBe('Manchester')
      expect(mockContext.global.answers.town).toEqual({
        current: 'Manchester',
        mutations: [
          { value: 'London', source: 'load' },
          { value: 'Manchester', source: 'post' },
        ],
      })
    })
  })
})
