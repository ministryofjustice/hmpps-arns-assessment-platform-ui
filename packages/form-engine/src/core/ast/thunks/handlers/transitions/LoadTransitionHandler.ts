import { NodeId } from '@form-engine/core/types/engine.type'
import { LoadTransitionASTNode, FunctionASTNode } from '@form-engine/core/types/expressions.type'
import { ThunkHandler, ThunkInvocationAdapter, HandlerResult } from '@form-engine/core/ast/thunks/types'
import ThunkEvaluationContext from '@form-engine/core/ast/thunks/ThunkEvaluationContext'
import { evaluateEffectsWithScope } from '@form-engine/core/ast/thunks/handlers/utils/evaluation'

/**
 * Handler for Load Transition nodes
 *
 * Evaluates onLoad transitions by executing all effects sequentially.
 * Effects are functions that typically load external data into context.data.
 *
 * The handler ensures all effects complete before the transition resolves,
 * enabling dependent nodes to access the loaded data.
 *
 * ## Wiring Pattern
 * Effects are wired sequentially in the dependency graph:
 * - effect[0] → effect[1] → effect[2] → transition
 * - Each effect must complete before the next begins
 * - Last effect wires to transition with DATA_FLOW edge
 *
 * ## Return Value
 * Returns undefined to indicate transition completion.
 * Side effects (data loading) occur in effect handlers.
 */
export default class LoadTransitionHandler implements ThunkHandler {
  constructor(
    public readonly nodeId: NodeId,
    private readonly node: LoadTransitionASTNode,
  ) {}

  async evaluate(context: ThunkEvaluationContext, invoker: ThunkInvocationAdapter): Promise<HandlerResult> {
    const effects = this.node.properties.effects as FunctionASTNode[]

    if (Array.isArray(effects) && effects.length > 0) {
      const effectIds = effects.map(effect => effect.id)

      await evaluateEffectsWithScope(effectIds, context, invoker)
    }

    return { value: undefined }
  }
}
