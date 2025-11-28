import { NodeId } from '@form-engine/core/types/engine.type'
import { AccessTransitionASTNode, FunctionASTNode } from '@form-engine/core/types/expressions.type'
import { ThunkHandler, ThunkInvocationAdapter, HandlerResult } from '@form-engine/core/ast/thunks/types'
import { isASTNode } from '@form-engine/core/typeguards/nodes'
import ThunkEvaluationContext from '@form-engine/core/ast/thunks/ThunkEvaluationContext'
import {
  evaluateEffectsWithScope,
  evaluateUntilFirstMatch,
} from '@form-engine/core/ast/thunks/handlers/utils/evaluation'

/**
 * Result of an access transition evaluation
 */
export interface AccessTransitionResult {
  /**
   * Whether the guards passed (access granted)
   */
  passed: boolean

  /**
   * Navigation target if guards failed (from redirect expressions)
   */
  redirect?: string

  /**
   * Effect NodeIds that were executed
   */
  executedEffects?: NodeId[]
}

/**
 * Handler for Access Transition nodes
 *
 * Evaluates onAccess transitions by:
 * 1. Evaluating guards predicate
 * 2. If guards fail → evaluating redirect expressions for navigation target
 * 3. Executing effects (analytics, logging, etc.)
 *
 * ## Lifecycle Position
 * Access transitions run after onLoad at each hierarchy level:
 * OUTER onLoad → OUTER onAccess → INNER onLoad → INNER onAccess → Step onLoad → Step onAccess
 *
 * ## Guards Semantics
 * - guards: true (or absent) → access granted, continue to next level
 * - guards: false → access denied, evaluate redirect for navigation target
 *
 * ## Effects
 * Effects always execute (for logging/analytics), regardless of guard result.
 * They run BEFORE guards are evaluated.
 */
export default class AccessTransitionHandler implements ThunkHandler {
  constructor(
    public readonly nodeId: NodeId,
    private readonly node: AccessTransitionASTNode,
  ) {}

  async evaluate(
    context: ThunkEvaluationContext,
    invoker: ThunkInvocationAdapter,
  ): Promise<HandlerResult<AccessTransitionResult>> {
    // Execute effects first (logging, analytics, etc.)
    const executedEffects = await this.executeEffects(context, invoker)

    // Evaluate guards predicate
    const guardsPassed = await this.evaluateGuardsPredicate(context, invoker)

    if (guardsPassed) {
      return {
        value: {
          passed: true,
          executedEffects: executedEffects.length > 0 ? executedEffects : undefined,
        },
      }
    }

    // Guards failed - evaluate redirect to get navigation target
    const redirect = await this.evaluateRedirect(context, invoker)

    return {
      value: {
        passed: false,
        redirect,
        executedEffects: executedEffects.length > 0 ? executedEffects : undefined,
      },
    }
  }

  /**
   * Evaluate the guards predicate
   * Returns true if predicate passes or doesn't exist
   */
  private async evaluateGuardsPredicate(
    context: ThunkEvaluationContext,
    invoker: ThunkInvocationAdapter,
  ): Promise<boolean> {
    const guards = this.node.properties.guards

    if (!isASTNode(guards)) {
      return true
    }

    const result = await invoker.invoke(guards.id, context)

    if (result.error) {
      return false
    }

    return Boolean(result.value)
  }

  /**
   * Execute effects sequentially
   * Returns array of executed effect NodeIds
   */
  private async executeEffects(context: ThunkEvaluationContext, invoker: ThunkInvocationAdapter): Promise<NodeId[]> {
    const effects = this.node.properties.effects as FunctionASTNode[] | undefined

    if (!effects || !Array.isArray(effects) || effects.length === 0) {
      return []
    }

    const effectIds = effects.filter(isASTNode).map(effect => effect.id)

    return evaluateEffectsWithScope(effectIds, context, invoker)
  }

  /**
   * Evaluate redirect expressions to determine navigation target
   * Returns the first matching redirect path
   */
  private async evaluateRedirect(
    context: ThunkEvaluationContext,
    invoker: ThunkInvocationAdapter,
  ): Promise<string | undefined> {
    const redirect = this.node.properties.redirect

    if (!redirect || !Array.isArray(redirect)) {
      return undefined
    }

    const redirectIds = redirect.filter(isASTNode).map(node => node.id)
    const result = await evaluateUntilFirstMatch(redirectIds, context, invoker)

    return result !== undefined ? String(result) : undefined
  }
}
