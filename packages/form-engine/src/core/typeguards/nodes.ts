import { ASTNode } from '@form-engine/core/types/engine.type'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { PseudoNode, PseudoNodeType } from '@form-engine/core/types/pseudoNodes.type'
import type { TemplateNode } from '@form-engine/core/types/template.type'

/**
 * Check if a value is an AST node (excludes template nodes)
 */
export function isASTNode(value: any): value is ASTNode {
  return value != null &&
    typeof value === 'object' &&
    typeof value.type === 'string' &&
    Object.values(ASTNodeType).includes(value.type) &&
    value.type !== ASTNodeType.TEMPLATE
}

/**
 * Check if a value is a template node
 */
export function isTemplateNode(value: unknown): value is TemplateNode {
  return value != null && typeof value === 'object' && 'type' in value && value.type === ASTNodeType.TEMPLATE
}

/**
 * Type guard to check if a node is a pseudo node
 */
export function isPseudoNode(node: ASTNode | PseudoNode): node is PseudoNode {
  return node != null && 'type' in node && Object.values(PseudoNodeType).includes(node.type as PseudoNodeType)
}
