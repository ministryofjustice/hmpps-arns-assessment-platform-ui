import { WiringContext } from '@form-engine/core/ast/dependencies/WiringContext'
import { DependencyEdgeType } from '@form-engine/core/ast/dependencies/DependencyGraph'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { ExpressionASTNode, NotPredicateASTNode } from '@form-engine/core/types/expressions.type'
import { NodeId } from '@form-engine/core/types/engine.type'
import { isASTNode } from '@form-engine/core/typeguards/nodes'
import { isPredicateNotNode } from '@form-engine/core/typeguards/predicate-nodes'

/**
 * NotWiring: Wires NOT predicate expressions to their operand
 *
 * Creates dependency edges for NOT nodes:
 * - NOT predicates have a single operand that must be evaluated
 *
 * Wiring pattern:
 * - OPERAND → NOT_NODE (operand must be evaluated first)
 */
export default class NotWiring {
  constructor(private readonly wiringContext: WiringContext) {}

  wire(): void {
    const expressionNodes = this.wiringContext.findNodesByType<ExpressionASTNode>(ASTNodeType.EXPRESSION)

    expressionNodes.filter(isPredicateNotNode).forEach(notNode => {
      this.wireNot(notNode)
    })
  }

  wireNodes(nodeIds: NodeId[]): void {
    nodeIds
      .map(id => this.wiringContext.nodeRegistry.get(id))
      .filter(isPredicateNotNode)
      .forEach(notNode => {
        this.wireNot(notNode)
      })
  }

  private wireNot(notNode: NotPredicateASTNode): void {
    const operand = notNode.properties.operand

    if (isASTNode(operand)) {
      this.wiringContext.graph.addEdge(operand.id, notNode.id, DependencyEdgeType.DATA_FLOW, {
        property: 'operand',
      })
    }
  }
}
