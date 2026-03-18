import { ThunkInvocationAdapter } from '@form-engine/core/compilation/thunks/types'
import ValidationTemplateAnalyzer from '@form-engine/core/compilation/ValidationTemplateAnalyzer'
import { StepRuntimePlan } from '@form-engine/core/compilation/StepRuntimePlanBuilder'
import ThunkEvaluationContext from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import { IterateASTNode } from '@form-engine/core/types/expressions.type'
import { FieldBlockASTNode } from '@form-engine/core/types/structures.type'
import { NodeId } from '@form-engine/core/types/engine.type'
import getAncestorChain from '@form-engine/core/utils/getAncestorChain'
import { BlockType, ExpressionType } from '@form-engine/form/types/enums'

export interface ValidationExecutionResult {
  isValid: boolean
  expandedIterateNodeIds: NodeId[]
  evaluatedBlockIds: NodeId[]
  // TODO: When ValidationExecutor is used directly by render/submission orchestration,
  // return field/block-level validation failures here as well (code/blockCode, message, details),
  // so rendering does not need to rediscover them from evaluated blocks.
}

export default class ValidationExecutor {
  async execute(
    runtimePlan: StepRuntimePlan,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<ValidationExecutionResult> {
    const expandedIterateNodeIds = await this.expandValidationIterators(runtimePlan, invoker, context)
    const evaluatedBlockIds = this.collectValidationBlockIds(runtimePlan, expandedIterateNodeIds, context)

    if (evaluatedBlockIds.length === 0) {
      return {
        isValid: true,
        expandedIterateNodeIds,
        evaluatedBlockIds,
      }
    }

    const blockResults = await Promise.all(
      evaluatedBlockIds.map(async blockId => {
        const result = await invoker.invoke(blockId, context)

        if (result.error) {
          return []
        }

        const block = result.value as { properties?: { validate?: Array<{ passed: boolean }> } }

        if (!Array.isArray(block.properties?.validate)) {
          return []
        }

        return block.properties.validate
      }),
    )

    const validations = blockResults.flat()

    if (validations.length === 0) {
      return { isValid: true, expandedIterateNodeIds, evaluatedBlockIds }
    }

    return {
      isValid: validations.every(validation => validation.passed === true),
      expandedIterateNodeIds,
      evaluatedBlockIds,
    }
  }

  private async expandValidationIterators(
    runtimePlan: StepRuntimePlan,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<NodeId[]> {
    const pendingIterateNodeIds = [...runtimePlan.validationIterateNodeIds]
    const expandedIterateNodeIds: NodeId[] = []
    const seenIterateNodeIds = new Set<NodeId>()

    while (pendingIterateNodeIds.length > 0) {
      const iterateNodeId = pendingIterateNodeIds.shift()

      if (iterateNodeId !== undefined && !seenIterateNodeIds.has(iterateNodeId)) {
        seenIterateNodeIds.add(iterateNodeId)
        expandedIterateNodeIds.push(iterateNodeId)

        // eslint-disable-next-line no-await-in-loop
        await invoker.invoke(iterateNodeId, context)

        const nestedIterateNodeIds = this.findNestedValidationIterateNodeIds(iterateNodeId, context)

        nestedIterateNodeIds.forEach(nestedIterateNodeId => {
          if (!seenIterateNodeIds.has(nestedIterateNodeId)) {
            pendingIterateNodeIds.push(nestedIterateNodeId)
          }
        })
      }
    }

    return expandedIterateNodeIds
  }

  private collectValidationBlockIds(
    runtimePlan: StepRuntimePlan,
    expandedIterateNodeIds: NodeId[],
    context: ThunkEvaluationContext,
  ): NodeId[] {
    const blockIds = new Set(runtimePlan.validationBlockIds)

    if (expandedIterateNodeIds.length === 0) {
      return [...blockIds]
    }

    const expandedIterateNodeIdSet = new Set(expandedIterateNodeIds)

    context.nodeRegistry.findByType<FieldBlockASTNode>(BlockType.FIELD)
      .filter(block => {
        const ancestors = getAncestorChain(block.id, context.metadataRegistry)

        return ancestors.some(ancestorId => expandedIterateNodeIdSet.has(ancestorId))
      })
      .forEach(block => {
        blockIds.add(block.id)
      })

    return [...blockIds]
  }

  private findNestedValidationIterateNodeIds(parentIterateNodeId: NodeId, context: ThunkEvaluationContext): NodeId[] {
    return (
      context.nodeRegistry.findByType<IterateASTNode>(ExpressionType.ITERATE)
        .filter(node => node.id !== parentIterateNodeId)
        .filter(node => {
          const ancestors = getAncestorChain(node.id, context.metadataRegistry)

          return ancestors.includes(parentIterateNodeId)
        })
        .filter(node => ValidationTemplateAnalyzer.mayYieldValidatingFields(node.properties.iterator.yieldTemplate))
        .map(node => node.id)
    )
  }
}
