import { ASTNodeType } from '@form-engine/core/types/enums'
import { ExpressionType, FunctionType, LogicType } from '@form-engine/form/types/enums'
import type {
  PredicateAndExpr,
  PredicateNotExpr,
  PredicateOrExpr,
  PredicateTestExpr,
  ValueExpr,
} from '@form-engine/form/types/expressions.type'
import { NodeIDCategory, NodeIDGenerator } from '@form-engine/core/ast/nodes/NodeIDGenerator'
import InvalidNodeError from '@form-engine/errors/InvalidNodeError'
import { ExpressionASTNode } from '@form-engine/core/types/expressions.type'
import { NodeFactory } from '@form-engine/core/ast/nodes/NodeFactory'
import AndFactory from './AndFactory'

describe('AndFactory', () => {
  let nodeIDGenerator: NodeIDGenerator
  let nodeFactory: NodeFactory
  let andFactory: AndFactory

  beforeEach(() => {
    nodeIDGenerator = new NodeIDGenerator()
    nodeFactory = new NodeFactory(nodeIDGenerator, NodeIDCategory.COMPILE_AST)
    andFactory = new AndFactory(nodeIDGenerator, nodeFactory, NodeIDCategory.COMPILE_AST)
  })

  describe('create()', () => {
    it('should create an And predicate with multiple operands', () => {
      // Arrange
      const json = {
        type: LogicType.AND,
        operands: [
          {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field1'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
          } satisfies PredicateTestExpr,
          {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field2'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
          } satisfies PredicateTestExpr,
        ],
      } satisfies PredicateAndExpr

      // Act
      const result = andFactory.create(json)

      // Assert
      expect(result.id).toBeDefined()
      expect(result.type).toBe(ASTNodeType.EXPRESSION)
      expect(result.expressionType).toBe(LogicType.AND)
      expect(result.raw).toBe(json)
      expect(Array.isArray(result.properties.operands)).toBe(true)
      expect(result.properties.operands).toHaveLength(2)
    })

    it('should transform each operand using nodeFactory', () => {
      // Arrange
      const json = {
        type: LogicType.AND,
        operands: [
          {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field1'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
          } satisfies PredicateTestExpr,
          {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field2'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
          } satisfies PredicateTestExpr,
        ],
      } satisfies PredicateAndExpr

      // Act
      const result = andFactory.create(json)

      // Assert
      result.properties.operands.forEach((operand: ExpressionASTNode) => {
        expect(operand.type).toBe(ASTNodeType.EXPRESSION)
        expect(operand.expressionType).toBe(LogicType.TEST)
      })
    })

    it('should handle nested And predicates', () => {
      // Arrange
      const json = {
        type: LogicType.AND,
        operands: [
          {
            type: LogicType.AND,
            operands: [
              {
                type: LogicType.TEST,
                subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field1'] },
                negate: false,
                condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
              } satisfies PredicateTestExpr,
              {
                type: LogicType.TEST,
                subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field1'] },
                negate: false,
                condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
              } satisfies PredicateTestExpr,
            ],
          } satisfies PredicateAndExpr,
          {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field2'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
          } satisfies PredicateTestExpr,
        ],
      } satisfies PredicateAndExpr

      // Act
      const result = andFactory.create(json)

      // Assert
      expect((result.properties.operands[0] as ExpressionASTNode).expressionType).toBe(LogicType.AND)
      expect((result.properties.operands[1] as ExpressionASTNode).expressionType).toBe(LogicType.TEST)
    })

    it('should handle mixed operand types', () => {
      // Arrange
      const json = {
        type: LogicType.AND,
        operands: [
          {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field1'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
          } satisfies PredicateTestExpr,
          {
            type: LogicType.NOT,
            operand: {
              type: LogicType.TEST,
              subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field2'] },
              negate: false,
              condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
            } satisfies PredicateTestExpr,
          } satisfies PredicateNotExpr,
          {
            type: LogicType.OR,
            operands: [
              {
                type: LogicType.TEST,
                subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field3'] },
                negate: false,
                condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
              } satisfies PredicateTestExpr,
              {
                type: LogicType.TEST,
                subject: { type: ExpressionType.REFERENCE, path: ['answers', 'field3'] },
                negate: false,
                condition: { type: FunctionType.CONDITION, name: 'IsTrue', arguments: [] as ValueExpr[] },
              } satisfies PredicateTestExpr,
            ],
          } satisfies PredicateOrExpr,
        ],
      } satisfies PredicateAndExpr

      // Act
      const result = andFactory.create(json)

      // Assert
      expect(result.properties.operands).toHaveLength(3)
      expect((result.properties.operands[0] as ExpressionASTNode).expressionType).toBe(LogicType.TEST)
      expect((result.properties.operands[1] as ExpressionASTNode).expressionType).toBe(LogicType.NOT)
      expect((result.properties.operands[2] as ExpressionASTNode).expressionType).toBe(LogicType.OR)
    })

    it('should throw InvalidNodeError when operands is missing', () => {
      // Arrange
      const json = {
        type: LogicType.AND,
      } as any

      // Act & Assert
      expect(() => andFactory.create(json)).toThrow(InvalidNodeError)
      expect(() => andFactory.create(json)).toThrow('And predicate requires a non-empty operands array')
    })

    it('should throw InvalidNodeError when operands is empty', () => {
      // Arrange
      const json = {
        type: LogicType.AND,
        operands: [],
      } as any

      // Act & Assert
      expect(() => andFactory.create(json)).toThrow(InvalidNodeError)
      expect(() => andFactory.create(json)).toThrow('And predicate requires a non-empty operands array')
    })
  })
})
