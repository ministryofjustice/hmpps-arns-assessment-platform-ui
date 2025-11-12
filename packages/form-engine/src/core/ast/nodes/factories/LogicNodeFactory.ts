import {
  isPredicateTestExpr,
  isPredicateNotExpr,
  isPredicateAndExpr,
  isPredicateOrExpr,
  isPredicateXorExpr,
} from '@form-engine/form/typeguards/predicates'
import { isConditionalExpr } from '@form-engine/form/typeguards/expressions'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { LogicType } from '@form-engine/form/types/enums'
import { ConditionalASTNode, PredicateASTNode, TestPredicateASTNode } from '@form-engine/core/types/expressions.type'
import UnknownNodeTypeError from '@form-engine/errors/UnknownNodeTypeError'
import InvalidNodeError from '@form-engine/errors/InvalidNodeError'
import { NodeIDGenerator, NodeIDCategory } from '@form-engine/core/ast/nodes/NodeIDGenerator'
import {
  ConditionalExpr,
  PredicateAndExpr,
  PredicateNotExpr,
  PredicateOrExpr,
  PredicateTestExpr,
  PredicateXorExpr,
} from '@form-engine/form/types/expressions.type'
import { NodeFactory } from '../NodeFactory'

/**
 * LogicNodeFactory: Creates logic nodes (Conditional, Predicates)
 * Handles boolean logic and conditional expressions
 */
export class LogicNodeFactory {
  constructor(
    private readonly nodeIDGenerator: NodeIDGenerator,
    private readonly nodeFactory: NodeFactory,
  ) {}

  /**
   * Create a logic node based on the JSON type
   */
  create(json: any): ConditionalASTNode | TestPredicateASTNode | PredicateASTNode {
    if (isConditionalExpr(json)) {
      return this.createConditional(json)
    }

    if (isPredicateTestExpr(json)) {
      return this.createTestPredicate(json)
    }

    if (isPredicateNotExpr(json)) {
      return this.createNotPredicate(json)
    }

    if (isPredicateAndExpr(json) || isPredicateOrExpr(json) || isPredicateXorExpr(json)) {
      return this.createLogicalPredicate(json)
    }

    throw new UnknownNodeTypeError({
      nodeType: json?.type,
      node: json,
      validTypes: ['Conditional', 'Test', 'And', 'Or', 'Xor', 'Not'],
    })
  }

  /**
   * Transform Conditional expression: If-then-else logic
   * Evaluates predicate to choose between two values
   * Defaults: thenValue = true, elseValue = false
   */
  private createConditional(json: ConditionalExpr): ConditionalASTNode {
    if (!json.predicate) {
      throw new InvalidNodeError({
        message: 'Conditional expression requires a predicate',
        node: json,
        expected: 'predicate property',
        actual: 'undefined',
      })
    }

    return {
      id: this.nodeIDGenerator.next(NodeIDCategory.COMPILE_AST),
      type: ASTNodeType.EXPRESSION,
      expressionType: LogicType.CONDITIONAL,
      properties: {
        predicate: this.nodeFactory.createNode(json.predicate),
        thenValue: json.thenValue !== undefined ? this.nodeFactory.transformValue(json.thenValue) : true,
        elseValue: json.elseValue !== undefined ? this.nodeFactory.transformValue(json.elseValue) : false,
      },
      raw: json,
    }
  }

  /**
   * Transform TEST predicate: subject.condition with optional negation
   * Defaults: negate = false
   */
  private createTestPredicate(json: PredicateTestExpr): TestPredicateASTNode {
    if (!json.subject) {
      throw new InvalidNodeError({
        message: 'Test predicate requires a subject',
        node: json,
        expected: 'subject property',
        actual: 'undefined',
      })
    }

    if (!json.condition) {
      throw new InvalidNodeError({
        message: 'Test predicate requires a condition',
        node: json,
        expected: 'condition property',
        actual: 'undefined',
      })
    }

    return {
      id: this.nodeIDGenerator.next(NodeIDCategory.COMPILE_AST),
      type: ASTNodeType.EXPRESSION,
      expressionType: LogicType.TEST,
      properties: {
        subject: this.nodeFactory.createNode(json.subject),
        condition: this.nodeFactory.createNode(json.condition),
        negate: json.negate ?? false,
      },
      raw: json,
    }
  }

  /**
   * Transform NOT predicate: Single operand negation
   */
  private createNotPredicate(json: PredicateNotExpr): PredicateASTNode {
    const properties = new Map<string, any>()

    properties.set('operand', this.nodeFactory.createNode(json.operand))

    return {
      id: this.nodeIDGenerator.next(NodeIDCategory.COMPILE_AST),
      type: ASTNodeType.EXPRESSION,
      expressionType: LogicType.NOT,
      properties,
      raw: json,
    }
  }

  /**
   * Transform AND/OR/XOR predicate: Multiple operands (min 2)
   */
  private createLogicalPredicate(json: PredicateAndExpr | PredicateOrExpr | PredicateXorExpr): PredicateASTNode {
    const properties = new Map<string, any>()
    const operands = json.operands.map((operand: any) => this.nodeFactory.createNode(operand))

    properties.set('operands', operands)

    return {
      id: this.nodeIDGenerator.next(NodeIDCategory.COMPILE_AST),
      type: ASTNodeType.EXPRESSION,
      expressionType: json.type,
      properties,
      raw: json,
    }
  }
}
