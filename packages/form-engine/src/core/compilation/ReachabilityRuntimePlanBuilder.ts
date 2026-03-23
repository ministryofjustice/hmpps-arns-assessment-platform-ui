import { NodeId } from '@form-engine/core/types/engine.type'
import { StepASTNode } from '@form-engine/core/types/structures.type'
import { SubmitTransitionASTNode } from '@form-engine/core/types/expressions.type'
import { StepRuntimePlan } from '@form-engine/core/compilation/StepRuntimePlanBuilder'
import { isRedirectOutcomeNode } from '@form-engine/core/typeguards/outcome-nodes'

export interface ReachabilityRuntimePlan {
  entries: ReachabilityStepEntry[]
}

export interface ReachabilityStepEntry {
  stepId: NodeId
  path: string
  code?: string
  isEntryPoint: boolean
  stepRuntimePlan: StepRuntimePlan
  forwardOutcomeIds: NodeId[]
  hasValidation: boolean
}

/**
 * ReachabilityRuntimePlanBuilder - Pre-computes navigation graph structure for a journey
 *
 * Extracts the redirect outcome node IDs from each step's submit transitions so they
 * can be efficiently evaluated at runtime by the ReachabilityExecutor.
 *
 * For steps with validating submit transitions (validate: true), extracts outcomes
 * from the onValid.next branch (the "save and continue" path). For steps without
 * validation, extracts from onAlways.next.
 *
 * Navigation is scoped to the same parent journey. The plan only includes steps
 * from a single journey.
 */
export default class ReachabilityRuntimePlanBuilder {
  build(journeySteps: StepASTNode[], runtimePlansByStepId: Map<NodeId, StepRuntimePlan>): ReachabilityRuntimePlan {
    const entries = journeySteps.map(stepNode => {
      const runtimePlan = runtimePlansByStepId.get(stepNode.id)

      if (!runtimePlan) {
        throw new Error(`No runtime plan found for step: ${stepNode.id}`)
      }

      return this.buildEntry(stepNode, runtimePlan)
    })

    return { entries }
  }

  private buildEntry(stepNode: StepASTNode, runtimePlan: StepRuntimePlan): ReachabilityStepEntry {
    const { forwardOutcomeIds, hasValidation } = this.extractForwardNavigation(stepNode)

    return {
      stepId: stepNode.id,
      path: this.normalizePath(stepNode.properties.path),
      code: stepNode.properties.code,
      isEntryPoint: stepNode.properties.isEntryPoint === true,
      stepRuntimePlan: runtimePlan,
      forwardOutcomeIds,
      hasValidation,
    }
  }

  private extractForwardNavigation(stepNode: StepASTNode): {
    forwardOutcomeIds: NodeId[]
    hasValidation: boolean
  } {
    const submitTransitions = stepNode.properties.onSubmission ?? []
    const validatingTransitions = submitTransitions.filter(t => t.properties.validate === true)

    if (validatingTransitions.length > 0) {
      return {
        forwardOutcomeIds: this.extractOutcomeIdsFromValidBranch(validatingTransitions),
        hasValidation: true,
      }
    }

    return {
      forwardOutcomeIds: this.extractOutcomeIdsFromAlwaysBranch(submitTransitions),
      hasValidation: false,
    }
  }

  private extractOutcomeIdsFromValidBranch(transitions: SubmitTransitionASTNode[]): NodeId[] {
    return transitions.flatMap(transition =>
      (transition.properties.onValid?.next ?? [])
        .filter(isRedirectOutcomeNode)
        .map(node => node.id),
    )
  }

  private extractOutcomeIdsFromAlwaysBranch(transitions: SubmitTransitionASTNode[]): NodeId[] {
    return transitions.flatMap(transition =>
      (transition.properties.onAlways?.next ?? [])
        .filter(isRedirectOutcomeNode)
        .map(node => node.id),
    )
  }

  private normalizePath(path: string): string {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path

    return normalizedPath.split(/[?#]/)[0] ?? normalizedPath
  }
}
