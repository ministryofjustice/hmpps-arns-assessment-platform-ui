import { NodeId } from '@form-engine/core/types/engine.type'
import { BlockASTNode } from '@form-engine/core/types/structures.type'
import {
  ThunkHandler,
  ThunkInvocationAdapter,
  HandlerResult,
  MetadataComputationDependencies,
} from '@form-engine/core/compilation/thunks/types'
import ThunkEvaluationContext from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import { evaluatePropertyValue } from '@form-engine/core/utils/thunkEvaluatorsAsync'
import { evaluatePropertyValueSync } from '@form-engine/core/utils/thunkEvaluatorsSync'

/**
 * Handler for Block structure nodes (both field and basic blocks)
 *
 * Evaluates block properties for rendering/data use.
 * Validation properties are skipped because validation runs via ValidationExecutor.
 * Dependent properties are skipped because answer processing and validation own that logic.
 * Formatters are also skipped here because they are applied during submission.
 *
 * Synchronous when all nested AST nodes in properties are sync.
 * Asynchronous when any nested AST node is async.
 */
export default class BlockHandler implements ThunkHandler {
  isAsync = true

  constructor(
    public readonly nodeId: NodeId,
    private readonly node: BlockASTNode,
  ) {}

  computeIsAsync(deps: MetadataComputationDependencies): void {
    const properties = this.node.properties as Record<string, unknown>

    // eslint-disable-next-line no-restricted-syntax -- for...in avoids Object.keys() allocation in this hot path
    for (const key in properties) {
      if (!Object.prototype.hasOwnProperty.call(properties, key)) {
        continue // eslint-disable-line no-continue
      }

      const isRelevant = key !== 'formatters' && key !== 'validate' && key !== 'dependent'

      if (!isRelevant) {
        continue // eslint-disable-line no-continue
      }

      if (this.containsAsyncNodes(properties[key], deps)) {
        this.isAsync = true
        return
      }
    }

    this.isAsync = false
  }

  /**
   * Recursively check if a value contains any async AST nodes
   */
  private containsAsyncNodes(root: unknown, deps: MetadataComputationDependencies): boolean {
    const stack: unknown[] = [root]

    while (stack.length > 0) {
      const value = stack.pop()

      if (value === null || value === undefined) {
        continue // eslint-disable-line no-continue
      }

      if (isASTNode(value)) {
        const handler = deps.thunkHandlerRegistry.get(value.id)

        if (handler?.isAsync ?? true) {
          return true
        }

        continue // eslint-disable-line no-continue
      }

      if (Array.isArray(value)) {
        value.forEach(item => stack.push(item))
        continue // eslint-disable-line no-continue
      }

      if (typeof value === 'object') {
        const obj = value as Record<string, unknown>

        // eslint-disable-next-line no-restricted-syntax -- for...in avoids Object.values() allocation in this hot path
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            stack.push(obj[key])
          }
        }
      }
    }

    return false
  }

  evaluateSync(context: ThunkEvaluationContext, invoker: ThunkInvocationAdapter): HandlerResult {
    const propertiesToEvaluate = this.getPropertiesToEvaluate()
    const evaluatedProperties = this.evaluateBlockPropertiesSync(propertiesToEvaluate, context, invoker)

    return {
      value: {
        id: this.nodeId,
        type: this.node.type,
        variant: this.node.variant,
        blockType: this.node.blockType,
        properties: evaluatedProperties,
      },
    }
  }

  async evaluate(context: ThunkEvaluationContext, invoker: ThunkInvocationAdapter): Promise<HandlerResult> {
    const propertiesToEvaluate = this.getPropertiesToEvaluate()
    const evaluatedProperties = await this.evaluateBlockProperties(propertiesToEvaluate, context, invoker)

    return {
      value: {
        id: this.nodeId,
        type: this.node.type,
        variant: this.node.variant,
        blockType: this.node.blockType,
        properties: evaluatedProperties,
      },
    }
  }

  private getPropertiesToEvaluate(): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(this.node.properties).filter(([key]) => key !== 'validate' && key !== 'dependent'),
    )
  }

  private evaluateBlockPropertiesSync(
    properties: Record<string, unknown>,
    context: ThunkEvaluationContext,
    invoker: ThunkInvocationAdapter,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    Object.entries(properties).forEach(([key, value]) => {
      // Skip formatters - they are applied during submission, not rendering
      if (key === 'formatters') {
        result[key] = value
        return
      }

      result[key] = evaluatePropertyValueSync(value, context, invoker)
    })

    return result
  }

  /**
   * Evaluate block properties for render/data use.
   */
  private async evaluateBlockProperties(
    properties: Record<string, unknown>,
    context: ThunkEvaluationContext,
    invoker: ThunkInvocationAdapter,
  ): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {}

    await Promise.all(
      Object.entries(properties).map(async ([key, value]) => {
        // Skip formatters - they are applied during submission, not rendering
        if (key === 'formatters') {
          result[key] = value
          return
        }

        result[key] = await evaluatePropertyValue(value, context, invoker)
      }),
    )

    return result
  }
}
