import { ASTNodeType } from '@form-engine/core/types/enums'
import { ExpressionType, FunctionType, LogicType } from '@form-engine/form/types/enums'
import type { PredicateNotExpr, PredicateTestExpr, ValueExpr } from '@form-engine/form/types/expressions.type'
import { NodeIDCategory, NodeIDGenerator } from '@form-engine/core/ast/nodes/NodeIDGenerator'
import InvalidNodeError from '@form-engine/errors/InvalidNodeError'
import { ExpressionASTNode, NotPredicateASTNode } from '@form-engine/core/types/expressions.type'
import { NodeFactory } from '@form-engine/core/ast/nodes/NodeFactory'
import NotFactory from './NotFactory'

describe('NotFactory', () => {
  let nodeIDGenerator: NodeIDGenerator
  let nodeFactory: NodeFactory
  let notFactory: NotFactory

  beforeEach(() => {
    nodeIDGenerator = new NodeIDGenerator()
    nodeFactory = new NodeFactory(nodeIDGenerator, NodeIDCategory.COMPILE_AST)
    notFactory = new NotFactory(nodeIDGenerator, nodeFactory, NodeIDCategory.COMPILE_AST)
  })

  describe('create()', () => {
    it('should create a Not predicate with operand', () => {
      // Arrange
      const json = {
        type: LogicType.NOT,
        operand: {
          type: LogicType.TEST,
          subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field'] },
          negate: false,
          condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
        } satisfies PredicateTestExpr,
      } satisfies PredicateNotExpr

      // Act
      const result = notFactory.create(json)

      // Assert
      expect(result.id).toBeDefined()
      expect(result.type).toBe(ASTNodeType.EXPRESSION)
      expect(result.expressionType).toBe(LogicType.NOT)
      expect(result.raw).toBe(json)
      expect(result.properties.operand).toBeDefined()
    })

    it('should transform operand using nodeFactory', () => {
      // Arrange
      const json = {
        type: LogicType.NOT,
        operand: {
          type: LogicType.TEST,
          subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field'] },
          negate: false,
          condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
        } satisfies PredicateTestExpr,
      } satisfies PredicateNotExpr

      // Act
      const result = notFactory.create(json)
      const operand = result.properties.operand as ExpressionASTNode

      // Assert
      expect(operand.type).toBe(ASTNodeType.EXPRESSION)
      expect(operand.expressionType).toBe(LogicType.TEST)
    })

    it('should handle nested Not predicates', () => {
      // Arrange
      const json = {
        type: LogicType.NOT,
        operand: {
          type: LogicType.NOT,
          operand: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
          } satisfies PredicateTestExpr,
        } satisfies PredicateNotExpr,
      } satisfies PredicateNotExpr

      // Act
      const result = notFactory.create(json)
      const outerOperand = result.properties.operand as NotPredicateASTNode
      const innerOperand = outerOperand.properties.operand as ExpressionASTNode

      // Assert
      expect(outerOperand.expressionType).toBe(LogicType.NOT)
      expect(innerOperand.expressionType).toBe(LogicType.TEST)
    })

    it('should throw InvalidNodeError when operand is missing', () => {
      // Arrange
      const json = {
        type: LogicType.NOT,
      } as any

      // Act & Assert
      expect(() => notFactory.create(json)).toThrow(InvalidNodeError)
      expect(() => notFactory.create(json)).toThrow('Not predicate requires an operand')
    })
  })
})
