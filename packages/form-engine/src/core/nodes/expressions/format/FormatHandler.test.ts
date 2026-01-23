import { FormatASTNode } from '@form-engine/core/types/expressions.type'
import { ExpressionType } from '@form-engine/form/types/enums'
import { ASTTestFactory } from '@form-engine/test-utils/ASTTestFactory'
import {
  createMockContext,
  createMockInvoker,
  createMockInvokerWithError,
} from '@form-engine/test-utils/thunkTestHelpers'
import FormatHandler from './FormatHandler'

/**
 * Helper to create a format AST node for testing
 */
function createFormatNode(template: string, args: unknown[]): FormatASTNode {
  return ASTTestFactory.expression<FormatASTNode>(ExpressionType.FORMAT)
    .withProperty('template', template)
    .withProperty('arguments', args)
    .build()
}

describe('FormatHandler', () => {
  beforeEach(() => {
    ASTTestFactory.resetIds()
  })

  describe('evaluate', () => {
    it('should return template unchanged when no placeholders', async () => {
      // Arrange
      const formatNode = createFormatNode('Add a new goal', [])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Add a new goal')
    })

    it('should substitute single placeholder with primitive argument', async () => {
      // Arrange
      const formatNode = createFormatNode('Goal for %1', ['John Smith'])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Goal for John Smith')
    })

    it('should substitute multiple placeholders with primitive arguments', async () => {
      // Arrange
      const formatNode = createFormatNode('%1 has %2 steps to complete', ['Improve literacy skills', 3])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Improve literacy skills has 3 steps to complete')
    })

    it('should evaluate AST node arguments before substitution', async () => {
      // Arrange
      const refNode = ASTTestFactory.reference(['answers', 'forename'])
      const formatNode = createFormatNode('What goal should %1 try to achieve?', [refNode])

      const mockContext = createMockContext()
      const invoker = createMockInvoker({
        returnValueMap: new Map([[refNode.id, 'James']]),
      })

      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(invoker.invoke).toHaveBeenCalledWith(refNode.id, mockContext)
      expect(result.value).toBe('What goal should James try to achieve?')
    })

    it('should handle mix of primitive and AST node arguments', async () => {
      // Arrange
      const refNode = ASTTestFactory.reference(['data', 'goalUuid'])
      const formatNode = createFormatNode('/goal/%1/steps?status=%2', [refNode, 'active'])

      const mockContext = createMockContext()
      const invoker = createMockInvoker({
        returnValueMap: new Map([[refNode.id, 'abc-123-def']]),
      })

      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('/goal/abc-123-def/steps?status=active')
    })

    it('should use empty string for out of bounds placeholders', async () => {
      // Arrange
      const formatNode = createFormatNode('Goal: %1, Area: %2, Status: %3', ['Reduce reoffending'])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Goal: Reduce reoffending, Area: , Status: ')
    })

    it('should use empty string for null argument values', async () => {
      // Arrange
      const formatNode = createFormatNode('Target date: %1', [null])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Target date: ')
    })

    it('should use empty string for undefined argument values', async () => {
      // Arrange
      const formatNode = createFormatNode('Related areas: %1', [undefined])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Related areas: ')
    })

    it('should use empty string for failed argument evaluations', async () => {
      // Arrange
      const refNode = ASTTestFactory.reference(['answers', 'missingField'])
      const formatNode = createFormatNode('Area of need: %1', [refNode])

      const mockContext = createMockContext()
      const invoker = createMockInvokerWithError({ nodeId: refNode.id, message: 'Reference not found' })

      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Area of need: ')
    })

    it('should handle same placeholder used multiple times', async () => {
      // Arrange
      const formatNode = createFormatNode('%1 completed %2 of %2 steps', ['John', 3])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('John completed 3 of 3 steps')
    })

    it('should convert number arguments to strings', async () => {
      // Arrange
      const formatNode = createFormatNode('%1 of %2 steps completed', [2, 5])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('2 of 5 steps completed')
    })

    it('should convert boolean arguments to strings', async () => {
      // Arrange
      const formatNode = createFormatNode('Goal active: %1, Has steps: %2', [true, false])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Goal active: true, Has steps: false')
    })

    it('should evaluate arguments in parallel', async () => {
      // Arrange
      const ref1 = ASTTestFactory.reference(['data', 'areaOfNeed'])
      const ref2 = ASTTestFactory.reference(['data', 'goalTitle'])
      const formatNode = createFormatNode('%1: %2', [ref1, ref2])

      const mockContext = createMockContext()
      const invoker = createMockInvoker({
        returnValueMap: new Map([
          [ref1.id, 'Accommodation'],
          [ref2.id, 'Find stable housing'],
        ]),
      })

      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(invoker.invoke).toHaveBeenCalledTimes(2)
      expect(result.value).toBe('Accommodation: Find stable housing')
    })

    it('should handle %0 placeholder as out of bounds', async () => {
      // Arrange
      const formatNode = createFormatNode('Invalid: %0, Valid: %1', ['Employment'])
      const mockContext = createMockContext()
      const invoker = createMockInvoker()
      const handler = new FormatHandler(formatNode.id, formatNode)

      // Act
      const result = await handler.evaluate(mockContext, invoker)

      // Assert
      expect(result.value).toBe('Invalid: , Valid: Employment')
    })

    describe('HTML escaping', () => {
      it('should escape ampersand in arguments', async () => {
        // Arrange
        const formatNode = createFormatNode('<h1>%1</h1>', ['Drugs & alcohol support'])
        const mockContext = createMockContext()
        const invoker = createMockInvoker()
        const handler = new FormatHandler(formatNode.id, formatNode)

        // Act
        const result = await handler.evaluate(mockContext, invoker)

        // Assert - & is escaped to &amp; for safe HTML rendering
        expect(result.value).toBe('<h1>Drugs &amp; alcohol support</h1>')
      })

      it('should escape angle brackets in arguments', async () => {
        // Arrange
        const formatNode = createFormatNode('<p>%1</p>', ['<script>alert("xss")</script>'])
        const mockContext = createMockContext()
        const invoker = createMockInvoker()
        const handler = new FormatHandler(formatNode.id, formatNode)

        // Act
        const result = await handler.evaluate(mockContext, invoker)

        // Assert - < and > are escaped for XSS prevention
        expect(result.value).toBe('<p>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>')
      })

      it('should escape quotes in arguments', async () => {
        // Arrange
        const formatNode = createFormatNode('<span>%1</span>', ['Complete "thinking skills" programme'])
        const mockContext = createMockContext()
        const invoker = createMockInvoker()
        const handler = new FormatHandler(formatNode.id, formatNode)

        // Act
        const result = await handler.evaluate(mockContext, invoker)

        // Assert - quotes are escaped
        expect(result.value).toBe('<span>Complete &quot;thinking skills&quot; programme</span>')
      })

      it('should preserve user-typed HTML entities by double-escaping', async () => {
        // Arrange - user intentionally typed "&amp;"
        const formatNode = createFormatNode('<h2>Goal: %1</h2>', ['Learn about R&amp;D processes'])
        const mockContext = createMockContext()
        const invoker = createMockInvoker()
        const handler = new FormatHandler(formatNode.id, formatNode)

        // Act
        const result = await handler.evaluate(mockContext, invoker)

        // Assert - the & in &amp; is escaped to &amp;, so output is &amp;amp;
        // When rendered as HTML, this displays as "&amp;" (user's intent preserved)
        expect(result.value).toBe('<h2>Goal: Learn about R&amp;amp;D processes</h2>')
      })

      it('should handle complex user input with special characters', async () => {
        // Arrange - realistic user input with multiple special characters
        const formatNode = createFormatNode('<h2>%1</h2>', [
          "Complete life skills course ('basic') - cooking & cleaning > 80% attendance &amp; participation",
        ])
        const mockContext = createMockContext()
        const invoker = createMockInvoker()
        const handler = new FormatHandler(formatNode.id, formatNode)

        // Act
        const result = await handler.evaluate(mockContext, invoker)

        // Assert - all special characters properly escaped
        expect(result.value).toBe(
          '<h2>Complete life skills course (&#39;basic&#39;) - cooking &amp; cleaning &gt; 80% attendance &amp;amp; participation</h2>',
        )
      })

      it('should not escape the template, only arguments', async () => {
        // Arrange - template has HTML tags, arguments have user content
        const formatNode = createFormatNode('<a href="/goal/%1">View %2</a>', ['abc-123', 'Health & wellbeing goal'])
        const mockContext = createMockContext()
        const invoker = createMockInvoker()
        const handler = new FormatHandler(formatNode.id, formatNode)

        // Act
        const result = await handler.evaluate(mockContext, invoker)

        // Assert - template HTML preserved, only argument values escaped
        expect(result.value).toBe('<a href="/goal/abc-123">View Health &amp; wellbeing goal</a>')
      })
    })
  })
})
