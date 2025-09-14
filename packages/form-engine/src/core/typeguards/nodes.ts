import { isBlockStructNode, isJourneyStructNode, isStepStructNode } from '@form-engine/core/typeguards/structure-nodes'
import { isFunctionExprNode, isPredicateExprNode } from '@form-engine/core/typeguards/expression-nodes'
import { ASTNode } from '@form-engine/core/types/engine.type'
import { isTransitionNode } from '@form-engine/core/typeguards/transition-nodes'

/**
 * Check if a value is an AST node
 */
export function isASTNode(node: any): node is ASTNode {
  return (
    isBlockStructNode(node) ||
    isPredicateExprNode(node) ||
    isFunctionExprNode(node) ||
    isTransitionNode(node) ||
    isJourneyStructNode(node) ||
    isStepStructNode(node)
  )
}
