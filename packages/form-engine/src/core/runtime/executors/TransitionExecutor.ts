import { NodeId, FormInstanceDependencies } from '@form-engine/core/types/engine.type'
import { ThunkInvocationAdapter } from '@form-engine/core/compilation/thunks/types'
import ThunkEvaluationContext from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import { AccessTransitionResult } from '@form-engine/core/nodes/transitions/access/AccessHandler'
import { ActionTransitionResult } from '@form-engine/core/nodes/transitions/action/ActionHandler'
import { SubmitTransitionResult } from '@form-engine/core/nodes/transitions/submit/SubmitHandler'
import {
  AccessTransitionASTNode,
  ActionTransitionASTNode,
  SubmitTransitionASTNode,
} from '@form-engine/core/types/expressions.type'
import { JourneyASTNode, StepASTNode } from '@form-engine/core/types/structures.type'
import getAncestorChain from '@form-engine/core/utils/getAncestorChain'

/**
 * TransitionExecutor - Runs lifecycle transitions for form steps
 *
 * Pure transition orchestration: iterates transition arrays with the correct
 * semantics (halt / first-match) and returns the existing result types.
 * Does not own ancestor resolution, static-data merging, redirects, or rendering.
 *
 * ## Access transitions
 * Runs an ancestor's onAccess array in sequence. Invocation errors are
 * warned and skipped. Halts on redirect or error outcome.
 *
 * ## Action transitions
 * First-match semantics: stops at the first transition that executes.
 *
 * ## Submit transitions
 * First-match semantics: stops at the first transition that executes.
 */
export default class TransitionExecutor {
  constructor(private readonly logger: FormInstanceDependencies['logger']) {}

  /**
   * Run the full access lifecycle for a step: resolve ancestors, then run
   * onAccess transitions for each ancestor in outer-to-inner order.
   *
   * Static data merging should be done via ContextPreparer.prepare() before calling this.
   *
   * @returns The first halting result (redirect/error), or 'continue' if all ancestors pass
   */
  async executeAccessLifecycle(
    stepId: NodeId,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<AccessTransitionResult> {
    const ancestors = getAncestorChain(stepId, context.metadataRegistry)
      .map(nodeId => context.nodeRegistry.get(nodeId)) as JourneyASTNode[]

    for (const ancestor of ancestors) {
      // eslint-disable-next-line no-await-in-loop
      const result = await this.executeAccessTransitions(ancestor, invoker, context)

      if (result.outcome === 'redirect' || result.outcome === 'error') {
        return result
      }
    }

    return { executed: true, outcome: 'continue' }
  }

  /**
   * Run onAccess transitions for a single ancestor (journey or step).
   *
   * Invocation errors are warned and skipped.
   * Non-executed transitions (when condition was false) are skipped.
   * Halts on redirect or error outcome.
   *
   * @returns The first halting result (redirect/error), or a 'continue' result if all pass
   */
  async executeAccessTransitions(
    ancestor: JourneyASTNode | StepASTNode,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<AccessTransitionResult> {
    const transitions: AccessTransitionASTNode[] = ancestor.properties.onAccess ?? []

    for (const transition of transitions) {
      // eslint-disable-next-line no-await-in-loop
      const result = await invoker.invoke<AccessTransitionResult>(transition.id, context)

      if (result.error) {
        this.logger.warn(`Access transition error: ${result.error.message}`)
        // eslint-disable-next-line no-continue
        continue
      }

      if (!result.value?.executed) {
        // eslint-disable-next-line no-continue
        continue
      }

      if (result.value.outcome === 'redirect' || result.value.outcome === 'error') {
        return result.value
      }
    }

    return { executed: true, outcome: 'continue' }
  }

  /**
   * Run onAction transitions for a step with first-match semantics.
   */
  async executeActionTransitions(
    stepId: NodeId,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<ActionTransitionResult> {
    const step = context.nodeRegistry.get(stepId) as StepASTNode
    const transitions: ActionTransitionASTNode[] = step.properties.onAction ?? []

    for (const transition of transitions) {
      // eslint-disable-next-line no-await-in-loop
      const result = await invoker.invoke<ActionTransitionResult>(transition.id, context)

      if (!result.error && result.value?.executed) {
        return result.value
      }
    }

    return { executed: false }
  }

  /**
   * Run onSubmission transitions for a step with first-match semantics.
   */
  async executeSubmitTransitions(
    stepId: NodeId,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<SubmitTransitionResult> {
    const step = context.nodeRegistry.get(stepId) as StepASTNode
    const transitions: SubmitTransitionASTNode[] = step.properties.onSubmission ?? []

    for (const transition of transitions) {
      // eslint-disable-next-line no-await-in-loop
      const result = await invoker.invoke<SubmitTransitionResult>(transition.id, context)

      if (!result.error && result.value?.executed) {
        return result.value
      }
    }

    return { executed: false, validated: false, outcome: 'continue' }
  }
}
