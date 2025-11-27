import { ASTNode, NodeId } from '@form-engine/core/types/engine.type'
import { PseudoNode } from '@form-engine/core/types/pseudoNodes.type'
import { ThunkHandler } from '@form-engine/core/ast/thunks/types'
import { CompilationDependencies } from '@form-engine/core/ast/compilation/CompilationDependencies'
import ThunkTypeMismatchError from '@form-engine/errors/ThunkTypeMismatchError'

/**
 * Compiler that orchestrates the creation of thunk handlers for all nodes.
 *
 * Handlers are created using specialized factories based on node type:
 * - Pseudo nodes: PseudoNodeHandlerFactory
 * - Expression nodes: ReferenceHandler, CollectionHandler, ConditionalHandler, TestPredicateHandler, AndPredicateHandler, OrPredicateHandler, XorPredicateHandler, NotPredicateHandler, FormatHandler, PipelineHandler, LogicHandlerFactory, FunctionHandlerFactory
 * - Transition nodes: LoadTransitionHandler, AccessTransitionHandler, SubmitTransitionHandler
 * - Structural nodes: JourneyHandler, StepHandler, BlockHandler
 * - Unknown nodes: FallbackHandler
 */
export default class ThunkCompilerFactory {
  /**
   * Compile all nodes into thunk handlers
   *
   * Iterates through all nodes (both AST and pseudo) in the compilation dependencies,
   * creating a handler for each one and registering it in a ThunkHandlerRegistry.
   *
   * @param compilationDependencies - Contains nodeRegistry with all nodes to compile
   * @returns ThunkHandlerRegistry containing handlers for all nodes
   */
  compile(compilationDependencies: CompilationDependencies) {
    // Compile all nodes (AST and pseudo)
    compilationDependencies.nodeRegistry.getAllEntries().forEach((entry, nodeId) => {
      const handler = this.compileASTNode(nodeId, entry.node)

      compilationDependencies.thunkHandlerRegistry.register(nodeId, handler)
    })
  }

  /**
   * Compiles a node into a thunk handler
   *
   * Creates appropriate handler based on node type using typeguards.
   * Handler selection order:
   * 1. Pseudo nodes (AnswerLocal, AnswerRemote, Post, Query, Params, Data)
   * 2. Expression nodes (Reference, Collection, Conditional, TestPredicate, AndPredicate, OrPredicate, XorPredicate, NotPredicate, Format, Pipeline, Function)
   * 3. Transition nodes (Load, Access, Submit)
   * 4. Structural nodes (Journey, Step, Block)
   * 5. Fallback for unknown types
   *
   * Public to allow runtime node compilation (e.g., collection template instances)
   *
   * @param nodeId - The unique ID of the node
   * @param node - The AST node to compile
   * @returns A ThunkHandler for this node
   */
  compileASTNode(nodeId: NodeId, node: ASTNode | PseudoNode): ThunkHandler {
    // Pseudo nodes
    // if (isPseudoNode(node)) {
    //   switch (node.type) {
    //     case PseudoNodeType.POST:
    //       return new PostHandler(nodeId, node)
    //
    //     case PseudoNodeType.QUERY:
    //       return new QueryHandler(nodeId, node)
    //
    //     case PseudoNodeType.PARAMS:
    //       return new ParamsHandler(nodeId, node)
    //
    //     case PseudoNodeType.DATA:
    //       return new DataHandler(nodeId, node)
    //
    //     case PseudoNodeType.ANSWER_LOCAL:
    //       return new AnswerLocalHandler(nodeId, node)
    //
    //     case PseudoNodeType.ANSWER_REMOTE:
    //       return new AnswerRemoteHandler(nodeId, node)
    //
    //     default:
    //       throw ThunkInvalidNodeTypeError.create(
    //         nodeId,
    //         (node as any).type,
    //         [
    //           PseudoNodeType.POST,
    //           PseudoNodeType.QUERY,
    //           PseudoNodeType.PARAMS,
    //           PseudoNodeType.DATA,
    //           PseudoNodeType.ANSWER_LOCAL,
    //           PseudoNodeType.ANSWER_REMOTE,
    //         ],
    //         node,
    //       )
    //   }
    // }

    // Reference expressions - route by namespace
    // if (isReferenceExprNode(node)) {
    //   const namespace = node.properties.path[0]
    //
    //   switch (namespace) {
    //     case '@scope':
    //       return new ScopeReferenceHandler(nodeId, node)
    //
    //     case 'answers':
    //       return new AnswersReferenceHandler(nodeId, node)
    //
    //     case 'data':
    //       return new DataReferenceHandler(nodeId, node)
    //
    //     case 'post':
    //       return new PostReferenceHandler(nodeId, node)
    //
    //     case 'query':
    //       return new QueryReferenceHandler(nodeId, node)
    //
    //     case 'params':
    //       return new ParamsReferenceHandler(nodeId, node)
    //
    //     default:
    //       throw ThunkInvalidNodeTypeError.create(
    //         nodeId,
    //         `REFERENCE:${namespace}`,
    //         ['@scope', 'answers', 'data', 'post', 'query', 'params'],
    //         node,
    //       )
    //   }
    // }

    // Format expressions
    // if (isFormatExprNode(node)) {
    //   return new FormatHandler(nodeId, node)
    // }
    //
    // Pipeline expressions
    // if (isPipelineExprNode(node)) {
    //   return new PipelineHandler(nodeId, node)
    // }
    //
    // Collection expressions
    // if (isCollectionExprNode(node)) {
    //   return new CollectionHandler(nodeId, node)
    // }
    //
    // Conditional expressions
    // if (isConditionalExprNode(node)) {
    //   return new ConditionalHandler(nodeId, node)
    // }
    //
    // Test Predicate expressions
    // if (isPredicateTestNode(node)) {
    //   return new TestPredicateHandler(nodeId, node)
    // }
    //
    // And Predicate expressions
    // if (isPredicateAndNode(node)) {
    //   return new AndPredicateHandler(nodeId, node)
    // }
    //
    // Or Predicate expressions
    // if (isPredicateOrNode(node)) {
    //   return new OrPredicateHandler(nodeId, node)
    // }
    //
    // Xor Predicate expressions
    // if (isPredicateXorNode(node)) {
    //   return new XorPredicateHandler(nodeId, node)
    // }
    //
    // Not Predicate expressions
    // if (isPredicateNotNode(node)) {
    //   return new NotPredicateHandler(nodeId, node)
    // }
    //
    // Function expressions (CONDITION, TRANSFORMER, GENERATOR, EFFECT)
    // if (isFunctionExprNode(node)) {
    //   return new FunctionHandler(nodeId, node)
    // }
    //
    // if (isNextExprNode(node)) {
    //   return new NextHandler(nodeId, node)
    // }
    //
    // if (isValidationExprNode(node)) {
    //   return new ValidationHandler(nodeId, node)
    // }
    //
    // Transition nodes (LOAD, ACCESS, SUBMIT)
    // if (isLoadTransitionNode(node)) {
    //   return new LoadTransitionHandler(nodeId, node)
    // }
    //
    // if (isAccessTransitionNode(node)) {
    //   return new AccessTransitionHandler(nodeId, node)
    // }
    //
    // if (isSubmitTransitionNode(node)) {
    //   return new SubmitTransitionHandler(nodeId, node)
    // }
    //
    // Structural nodes (JOURNEY, STEP, BLOCK)
    // if (isJourneyStructNode(node)) {
    //   return new JourneyHandler(nodeId, node)
    // }
    //
    // if (isStepStructNode(node)) {
    //   return new StepHandler(nodeId, node)
    // }
    //
    // if (isBlockStructNode(node)) {
    //   return new BlockHandler(nodeId, node)
    // }

    // Fallback for unknown node types
    // return new FallbackHandler(nodeId, node)
    throw ThunkTypeMismatchError.invalidNodeType(nodeId, node.type, [
      'REFERENCE',
      'FORMAT',
      'PIPELINE',
      'COLLECTION',
      'CONDITIONAL',
      'TEST',
      'AND',
      'OR',
      'XOR',
      'NOT',
      'FUNCTION',
      'NEXT',
      'VALIDATION',
      'LOAD',
      'ACCESS',
      'SUBMIT',
      'JOURNEY',
      'STEP',
      'BLOCK',
    ])
  }
}
