import { NodeId } from '@form-engine/core/types/engine.type'
import { FormatASTNode } from '@form-engine/core/types/expressions.type'
import { ThunkHandler, ThunkInvocationAdapter, HandlerResult } from '@form-engine/core/ast/thunks/types'
import ThunkEvaluationContext from '@form-engine/core/ast/thunks/ThunkEvaluationContext'
import { evaluateOperand } from '@form-engine/core/ast/thunks/handlers/utils/evaluation'

/**
 * Handler for Format expression nodes
 *
 * Evaluates format expressions by:
 * 1. Evaluating all arguments (invoking AST nodes, preserving primitives)
 * 2. Substituting evaluated arguments into the template string
 * 3. Returning the formatted result
 *
 * ## Template Format
 * Templates use 1-indexed placeholders: %1, %2, %3, etc.
 * Example: "Hello %1, you have %2 ignored Slack messages" with args ["Tom", 500]
 * Result: "Hello Tom, you have 500 ignored Slack messages"
 *
 * ## Wiring Pattern
 * Arguments are wired as DATA_FLOW dependencies:
 * - arg[0] → format
 * - arg[1] → format
 * - etc.
 *
 * This ensures all arguments are evaluated before the format executes.
 */
export default class FormatHandler implements ThunkHandler {
  constructor(
    public readonly nodeId: NodeId,
    private readonly node: FormatASTNode,
  ) {}

  async evaluate(context: ThunkEvaluationContext, invoker: ThunkInvocationAdapter): Promise<HandlerResult> {
    const template = this.node.properties.template
    const rawArguments = this.node.properties.arguments

    // Evaluate all arguments (AST nodes invoked, primitives passed through)
    const evaluatedArguments = await Promise.all(rawArguments.map(arg => evaluateOperand(arg, context, invoker)))

    // Substitute arguments into template
    try {
      const result = this.formatTemplate(template, evaluatedArguments)

      return { value: result }
    } catch (cause) {
      return {
        error: {
          type: 'EVALUATION_FAILED',
          nodeId: this.nodeId,
          message: `Format expression failed: ${cause instanceof Error ? cause.message : String(cause)}`,
          cause: cause instanceof Error ? cause : new Error(String(cause)),
          context: {
            template,
            arguments: evaluatedArguments,
          },
        },
      }
    }
  }

  /**
   * Format a template string with evaluated arguments
   *
   * Replaces %1, %2, %3, etc. with corresponding argument values.
   * Placeholders are 1-indexed (first argument replaces %1).
   * Missing arguments are replaced with empty string.
   */
  private formatTemplate(template: string, args: unknown[]): string {
    return template.replace(/%(\d+)/g, (match, index) => {
      const argIndex = parseInt(index, 10) - 1

      if (argIndex < 0 || argIndex >= args.length) {
        return ''
      }

      const value = args[argIndex]

      if (value === undefined || value === null) {
        return ''
      }

      return String(value)
    })
  }
}
