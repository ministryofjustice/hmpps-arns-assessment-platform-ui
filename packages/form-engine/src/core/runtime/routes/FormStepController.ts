import createHttpError from 'http-errors'
import { NodeId, FormInstanceDependencies } from '@form-engine/core/types/engine.type'
import { CompiledForm } from '@form-engine/core/compilation/FormCompilationFactory'
import ThunkEvaluator, { EvaluationResult } from '@form-engine/core/compilation/thunks/ThunkEvaluator'
import { ThunkInvocationAdapter } from '@form-engine/core/compilation/thunks/types'
import ThunkEvaluationContext from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import { PseudoNodeType } from '@form-engine/core/types/pseudoNodes.type'
import RenderContextFactory from '@form-engine/core/runtime/rendering/RenderContextFactory'
import { JourneyMetadata } from '@form-engine/core/runtime/rendering/types'
import TransitionExecutor from '@form-engine/core/runtime/executors/TransitionExecutor'
import ContextPreparer from '@form-engine/core/runtime/executors/ContextPreparer'
import { StepController } from './types'

/**
 * FormStepController - Handles the full request lifecycle for form steps
 *
 * Manages GET (access) and POST (submission) requests, including:
 * - Lifecycle transitions (onAccess, onAction, onSubmission)
 * - AST evaluation
 * - Response rendering or redirecting
 *
 * ## GET Request Flow
 * For each ancestor (outer journey → inner journey → step):
 * 1. Run onAccess transitions (data loading, access control, analytics)
 * 2. If any transition halts with redirect → redirect
 * 3. If any transition halts with error → return HTTP error
 * After all ancestors pass:
 * 4. Evaluate AST
 * 5. Render response
 *
 * ## POST Request Flow
 * 1. Run full access lifecycle (same as GET)
 * 2. Run step's onAction transitions (in-page actions like postcode lookup)
 * 3. Run step's onSubmission transitions (validation, navigation, error handling)
 * 4. If submission has error → return HTTP error
 * 5. If submission has redirect → redirect
 * 6. Otherwise → evaluate AST and render (with validation errors if applicable)
 */
export default class FormStepController<TRequest, TResponse> implements StepController<TRequest, TResponse> {
  private readonly contextPreparer: ContextPreparer

  private readonly transitionExecutor: TransitionExecutor

  constructor(
    private readonly compiledForm: CompiledForm[number],
    private readonly dependencies: FormInstanceDependencies,
    private readonly navigationMetadata: JourneyMetadata[],
    private readonly currentStepPath: string,
  ) {
    this.contextPreparer = new ContextPreparer()
    this.transitionExecutor = new TransitionExecutor(this.dependencies.logger)
  }

  /** Handle GET request: run access lifecycle, evaluate AST, render response. */
  async get(req: TRequest, res: TResponse): Promise<void> {
    const request = this.dependencies.frameworkAdapter.toStepRequest(req)
    const response = this.dependencies.frameworkAdapter.toStepResponse(res)

    const evaluator = ThunkEvaluator.withRuntimeOverlay(this.compiledForm.artefact, this.dependencies)
    const context = this.contextPreparer.prepare(this.compiledForm.runtimePlan, evaluator, request, response)

    const accessResult = await this.transitionExecutor.executeAccessLifecycle(
      this.compiledForm.runtimePlan,
      evaluator,
      context,
    )

    if (accessResult.outcome === 'redirect') {
      return this.redirect(res, req, accessResult.redirect, context)
    }

    if (accessResult.outcome === 'error') {
      throw createHttpError(accessResult.status, accessResult.message || 'Access denied')
    }

    // TODO: Add 'reachability' check

    this.logValidationPlan()

    await this.expandIteratorsForStep(this.compiledForm.runtimePlan.iteratorRootIds, evaluator, context)

    await this.evaluateAnswerPseudoNodes(evaluator, context)

    const evaluationResult = await evaluator.evaluate(context)

    return this.render(res, req, evaluationResult)
  }

  /** Handle POST request: run access lifecycle, action/submit transitions, render or redirect. */
  async post(req: TRequest, res: TResponse): Promise<void> {
    const request = this.dependencies.frameworkAdapter.toStepRequest(req)
    const response = this.dependencies.frameworkAdapter.toStepResponse(res)

    const evaluator = ThunkEvaluator.withRuntimeOverlay(this.compiledForm.artefact, this.dependencies)
    const context = this.contextPreparer.prepare(this.compiledForm.runtimePlan, evaluator, request, response)

    const accessResult = await this.transitionExecutor.executeAccessLifecycle(
      this.compiledForm.runtimePlan,
      evaluator,
      context,
    )

    if (accessResult.outcome === 'redirect') {
      return this.redirect(res, req, accessResult.redirect, context)
    }

    if (accessResult.outcome === 'error') {
      throw createHttpError(accessResult.status, accessResult.message || 'Access denied')
    }

    // TODO: Add 'reachability' check

    this.logValidationPlan()

    await this.expandIteratorsForStep(this.compiledForm.runtimePlan.iteratorRootIds, evaluator, context)

    await this.evaluateAnswerPseudoNodes(evaluator, context)

    await this.transitionExecutor.executeActionTransitions(this.compiledForm.runtimePlan, evaluator, context)

    const submitResult = await this.transitionExecutor.executeSubmitTransitions(
      this.compiledForm.runtimePlan,
      evaluator,
      context,
    )

    if (submitResult.outcome === 'error') {
      throw createHttpError(submitResult.status!, submitResult.message || 'Submission error')
    }

    if (submitResult.outcome === 'redirect') {
      return this.redirect(res, req, submitResult.redirect, context)
    }

    if (submitResult.validated) {
      const evaluationResult = await evaluator.evaluate(context)

      return this.render(res, req, evaluationResult, { showValidationFailures: true })
    }

    const evaluationResult = await evaluator.evaluate(context)

    return this.render(res, req, evaluationResult)
  }

  /** Redirect to a URL, resolving relative paths against the current base URL. */
  private redirect(res: TResponse, req: TRequest, redirect: string, _context: ThunkEvaluationContext): void {
    if (redirect.includes('://') || redirect.startsWith('/')) {
      return this.dependencies.frameworkAdapter.redirect(res, redirect)
    }

    const baseUrl = this.dependencies.frameworkAdapter.getBaseUrl(req)

    return this.dependencies.frameworkAdapter.redirect(res, `${baseUrl}/${redirect}`)
  }

  /** Build render context from evaluation result and render the response. */
  private async render(
    res: TResponse,
    req: TRequest,
    evaluationResult: EvaluationResult,
    options: { showValidationFailures?: boolean } = {},
  ): Promise<void> {
    const renderContext = RenderContextFactory.build(evaluationResult, this.compiledForm.runtimePlan.renderStepId, {
      navigationMetadata: this.navigationMetadata,
      currentStepPath: this.currentStepPath,
      showValidationFailures: options.showValidationFailures,
    })

    return this.dependencies.frameworkAdapter.render(renderContext, req, res)
  }

  private logValidationPlan(): void {
    // eslint-disable-next-line no-console
    console.log('validation plan', {
      stepId: this.compiledForm.runtimePlan.stepId,
      validationIterateNodeIds: this.compiledForm.runtimePlan.validationIterateNodeIds,
      validationBlockIds: this.compiledForm.runtimePlan.validationBlockIds,
    })
  }

  /**
   * Expand iterators on the current step to create runtime field nodes.
   *
   * This must run before evaluateAnswerPseudoNodes so that dynamic fields
   * (created by Iterator.Map) have their ANSWER_LOCAL pseudo
   * nodes registered before answer processing.
   *
   * The runtime plan already contains the deduplicated root nodes that
   * need invoking for iterator expansion on this step.
   */
  private async expandIteratorsForStep(
    iteratorRootIds: NodeId[],
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<void> {
    if (iteratorRootIds.length === 0) {
      return
    }

    for (const ancestorId of iteratorRootIds) {
      // eslint-disable-next-line no-await-in-loop
      await invoker.invoke(ancestorId, context)
    }
  }

  /**
   * Evaluate all answer pseudo nodes before action/submit transitions.
   *
   * This ensures that effects in onAction and onSubmission can access
   * resolved answers, not just raw POST data. Each answer pseudo
   * node is invoked to trigger the full resolution pipeline:
   * POST → sanitize → format → dependent check.
   *
   * Both ANSWER_LOCAL (fields on this step) and ANSWER_REMOTE (fields
   * from other steps) are evaluated.
   *
   * If an action later modifies an answer via setAnswer(), the cache
   * is automatically invalidated, ensuring subsequent access sees
   * the action-modified value.
   */
  private async evaluateAnswerPseudoNodes(
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<void> {
    const localAnswerNodes = context.nodeRegistry.findByType(PseudoNodeType.ANSWER_LOCAL)
    const remoteAnswerNodes = context.nodeRegistry.findByType(PseudoNodeType.ANSWER_REMOTE)

    for (const node of [...localAnswerNodes, ...remoteAnswerNodes]) {
      // eslint-disable-next-line no-await-in-loop
      await invoker.invoke(node.id, context)
    }
  }
}
