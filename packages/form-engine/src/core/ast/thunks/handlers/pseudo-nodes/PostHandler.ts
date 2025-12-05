import { NodeId } from '@form-engine/core/types/engine.type'
import { PostPseudoNode, PseudoNodeType } from '@form-engine/core/types/pseudoNodes.type'
import { FieldBlockASTNode } from '@form-engine/core/types/structures.type'
import { ThunkHandler, HandlerResult } from '@form-engine/core/ast/thunks/types'
import { isSafePropertyKey } from '@form-engine/core/ast/utils/propertyAccess'
import ThunkEvaluationContext from '@form-engine/core/ast/thunks/ThunkEvaluationContext'
import ThunkEvaluationError from '@form-engine/errors/ThunkEvaluationError'

/**
 * Handler for POST pseudo nodes
 *
 * Returns form submission data from context.post using the base field code.
 *
 * When field.multiple is false (default), arrays are reduced to the first non-empty value.
 * When field.multiple is true, all values in the array are kept.
 *
 * Nested property access is handled by Reference expression handlers.
 */
export default class PostHandler implements ThunkHandler {
  constructor(
    public readonly nodeId: NodeId,
    private readonly pseudoNode: PostPseudoNode,
  ) {}

  async evaluate(context: ThunkEvaluationContext): Promise<HandlerResult> {
    const { baseFieldCode, fieldNodeId } = this.pseudoNode.properties

    // Validate field code is safe before using as property key
    if (!isSafePropertyKey(baseFieldCode)) {
      const error = ThunkEvaluationError.securityViolation(this.nodeId, baseFieldCode, PseudoNodeType.POST)

      return { error: error.toThunkError() }
    }

    // Read raw POST value from context
    const rawValue = context.request.post[baseFieldCode]

    // Apply multiple behavior if we have a field reference
    const value = this.applyMultipleBehavior(rawValue, fieldNodeId, context)

    return { value }
  }

  /**
   * Apply the multiple behavior to a value
   *
   * When multiple is false (default), arrays are reduced to the first non-empty value.
   * When multiple is true, all values in the array are kept as-is.
   */
  private applyMultipleBehavior(
    value: unknown,
    fieldNodeId: NodeId | undefined,
    context: ThunkEvaluationContext,
  ): unknown {
    if (!Array.isArray(value)) {
      return value
    }

    // If no field reference, default to extracting first non-empty value
    if (!fieldNodeId) {
      return this.getFirstNonEmpty(value)
    }

    const fieldNode = context.nodeRegistry.get(fieldNodeId) as FieldBlockASTNode

    // If field not found or multiple is true, keep all values
    if (fieldNode?.properties.multiple) {
      return value
    }

    return this.getFirstNonEmpty(value)
  }

  /**
   * Get the first non-empty value from an array
   * Returns undefined if no non-empty value is found
   *
   * A value is considered "empty" if it is null, undefined, or a whitespace-only string
   */
  private getFirstNonEmpty(values: unknown[]): unknown {
    return values.find(value => {
      if (value === undefined || value === null) {
        return false
      }

      if (typeof value === 'string') {
        return value.trim() !== ''
      }

      return true
    })
  }
}
