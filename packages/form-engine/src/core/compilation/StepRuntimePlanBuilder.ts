import { CompilationDependencies } from '@form-engine/core/compilation/CompilationDependencies'
import { NodeId } from '@form-engine/core/types/engine.type'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { IterateASTNode } from '@form-engine/core/types/expressions.type'
import { StepASTNode } from '@form-engine/core/types/structures.type'
import getAncestorChain from '@form-engine/core/utils/getAncestorChain'
import { ExpressionType } from '@form-engine/form/types/enums'

export interface StepRuntimePlan {
  stepId: NodeId
  accessAncestorIds: NodeId[]
  actionTransitionIds: NodeId[]
  submitTransitionIds: NodeId[]
  iteratorRootIds: NodeId[]
  validationBlockIds: NodeId[]
  renderAncestorIds: NodeId[]
  renderStepId: NodeId
}

export default class StepRuntimePlanBuilder {
  build(stepNode: StepASTNode, compilationDependencies: CompilationDependencies): StepRuntimePlan {
    const accessAncestorIds = getAncestorChain(stepNode.id, compilationDependencies.metadataRegistry)
    const actionTransitionIds = (stepNode.properties.onAction ?? []).map(transition => transition.id)
    const submitTransitionIds = (stepNode.properties.onSubmission ?? []).map(transition => transition.id)
    const iteratorRootIds = this.findIteratorRootIds(compilationDependencies)
    const validationBlockIds = compilationDependencies.nodeRegistry
      .findByType(ASTNodeType.BLOCK)
      .filter(node => compilationDependencies.metadataRegistry.get(node.id, 'isDescendantOfStep', false))
      .map(node => node.id)

    return {
      stepId: stepNode.id,
      accessAncestorIds,
      actionTransitionIds,
      submitTransitionIds,
      iteratorRootIds,
      validationBlockIds,
      renderAncestorIds: accessAncestorIds.slice(0, -1),
      renderStepId: stepNode.id,
    }
  }

  private findIteratorRootIds(compilationDependencies: CompilationDependencies): NodeId[] {
    const iteratorRootIds = new Set<NodeId>()

    compilationDependencies.nodeRegistry.findByType<IterateASTNode>(ExpressionType.ITERATE)
      .filter(node => compilationDependencies.metadataRegistry.get(node.id, 'isDescendantOfStep', false))
      .forEach(node => {
        const rootId = this.findTopmostAncestorUnderStep(node.id, compilationDependencies)

        if (rootId !== undefined) {
          iteratorRootIds.add(rootId)
        }
      })

    return [...iteratorRootIds]
  }

  private findTopmostAncestorUnderStep(
    nodeId: NodeId,
    compilationDependencies: CompilationDependencies,
  ): NodeId | undefined {
    let currentId: NodeId | undefined = nodeId
    let topmostId: NodeId | undefined

    while (currentId !== undefined) {
      const parentId = compilationDependencies.metadataRegistry.get<NodeId>(currentId, 'attachedToParentNode')

      if (parentId === undefined) {
        break
      }

      if (compilationDependencies.metadataRegistry.get(parentId, 'isCurrentStep', false)) {
        topmostId = currentId
        break
      }

      topmostId = currentId
      currentId = parentId
    }

    return topmostId
  }
}
