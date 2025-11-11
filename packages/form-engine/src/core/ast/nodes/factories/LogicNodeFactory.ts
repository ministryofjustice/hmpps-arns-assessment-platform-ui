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
import { ConditionalASTNode, PredicateASTNode } from '@form-engine/core/types/expressions.type'
import UnknownNodeTypeError from '@form-engine/errors/UnknownNodeTypeError'
import InvalidNodeError from '@form-engine/errors/InvalidNodeError'
import { NodeIDGenerator, NodeIDCategory } from '@form-engine/core/ast/nodes/NodeIDGenerator'
import { ConditionalExpr } from '@form-engine/form/types/expressions.type'
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
  create(json: any): ConditionalASTNode | PredicateASTNode {
    if (isConditionalExpr(json)) {
      return this.createConditional(json)
    }

    if (
      isPredicateTestExpr(json) ||
      isPredicateNotExpr(json) ||
      isPredicateAndExpr(json) ||
      isPredicateOrExpr(json) ||
      isPredicateXorExpr(json)
    ) {
      return this.createPredicate(json)
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
   * Transform Predicate expression: Boolean logic operators
   * Handles TEST, AND, OR, XOR, NOT operations
   */
  private createPredicate(json: any): PredicateASTNode {
    const predicateType = json.type
    const properties = new Map<string, any>()

    // TEST: subject.condition with optional negation
    if (isPredicateTestExpr(json)) {
      properties.set('subject', this.nodeFactory.createNode(json.subject))
      properties.set('negate', json.negate)
      properties.set('condition', this.nodeFactory.createNode(json.condition))
    } else if (isPredicateNotExpr(json)) {
      // NOT: Single operand negation
      properties.set('operand', this.nodeFactory.createNode(json.operand))
    } else if (isPredicateAndExpr(json) || isPredicateOrExpr(json) || isPredicateXorExpr(json)) {
      // AND/OR/XOR: Multiple operands (min 2)
      const operands = json.operands.map((operand: any) => this.nodeFactory.createNode(operand))

      properties.set('operands', operands)
    }

    return {
      id: this.nodeIDGenerator.next(NodeIDCategory.COMPILE_AST),
      type: ASTNodeType.EXPRESSION,
      expressionType: predicateType,
      properties,
      raw: json,
    }
  }
}
