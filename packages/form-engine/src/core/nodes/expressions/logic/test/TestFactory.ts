import { ASTNodeType } from '@form-engine/core/types/enums'
import { LogicType } from '@form-engine/form/types/enums'
import { TestPredicateASTNode } from '@form-engine/core/types/expressions.type'
import { PredicateTestExpr } from '@form-engine/form/types/expressions.type'
import InvalidNodeError from '@form-engine/errors/InvalidNodeError'
import { NodeIDGenerator, NodeIDCategory } from '@form-engine/core/ast/nodes/NodeIDGenerator'
import { NodeFactory } from '@form-engine/core/ast/nodes/NodeFactory'

/**
 * TestFactory: Creates Test predicate AST nodes
 *
 * Test predicates evaluate subject.condition with optional negation.
 * Defaults: negate = false
 */
export default class TestFactory {
  constructor(
    private readonly nodeIDGenerator: NodeIDGenerator,
    private readonly nodeFactory: NodeFactory,
    private readonly category: NodeIDCategory.COMPILE_AST | NodeIDCategory.RUNTIME_AST,
  ) {}

  /**
   * Transform TEST predicate: subject.condition with optional negation
   */
  create(json: PredicateTestExpr): TestPredicateASTNode {
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
      id: this.nodeIDGenerator.next(this.category),
      type: ASTNodeType.EXPRESSION,
      expressionType: LogicType.TEST,
      properties: {
        // Use transformValue to support both AST nodes and literals
        subject: this.nodeFactory.transformValue(json.subject),
        condition: this.nodeFactory.createNode(json.condition),
        negate: json.negate ?? false,
      },
      raw: json,
    }
  }
}
