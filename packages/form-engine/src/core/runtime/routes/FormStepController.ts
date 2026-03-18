import createHttpError from 'http-errors'
import { FormInstanceDependencies } from '@form-engine/core/types/engine.type'
import { CompiledForm } from '@form-engine/core/compilation/FormCompilationFactory'
import ThunkEvaluator, { EvaluationResult } from '@form-engine/core/compilation/thunks/ThunkEvaluator'
import { ThunkInvocationAdapter } from '@form-engine/core/compilation/thunks/types'
import ThunkEvaluationContext from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import { SubmitTransitionASTNode } from '@form-engine/core/types/expressions.type'
import RenderContextFactory from '@form-engine/core/runtime/rendering/RenderContextFactory'
import { JourneyMetadata } from '@form-engine/core/runtime/rendering/types'
import TransitionExecutor from '@form-engine/core/runtime/executors/TransitionExecutor'
import ContextPreparer from '@form-engine/core/runtime/executors/ContextPreparer'
import ValidationExecutor from '@form-engine/core/runtime/executors/ValidationExecutor'
import AnswerPreparer from '@form-engine/core/runtime/executors/AnswerPreparer'
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

  private readonly validationExecutor: ValidationExecutor

  private readonly answerPreparer: AnswerPreparer

  constructor(
    private readonly compiledForm: CompiledForm[number],
    private readonly dependencies: FormInstanceDependencies,
    private readonly navigationMetadata: JourneyMetadata[],
    private readonly currentStepPath: string,
  ) {
    this.contextPreparer = new ContextPreparer()
    this.transitionExecutor = new TransitionExecutor(this.dependencies.logger)
    this.validationExecutor = new ValidationExecutor()
    this.answerPreparer = new AnswerPreparer()
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

    await this.answerPreparer.prepare(this.compiledForm.runtimePlan, evaluator, context)

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

    await this.answerPreparer.prepare(this.compiledForm.runtimePlan, evaluator, context)

    await this.transitionExecutor.executeActionTransitions(this.compiledForm.runtimePlan, evaluator, context)

    await this.evaluateValidationForSubmitTransitionsIfNeeded(evaluator, context)

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

  private async evaluateValidationForSubmitTransitionsIfNeeded(
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<void> {
    if (!this.hasValidatingSubmitTransition()) {
      return
    }

    const validation = await this.validationExecutor.execute(this.compiledForm.runtimePlan, invoker, context)

    context.global.validation = {
      stepId: this.compiledForm.runtimePlan.stepId,
      validated: true,
      isValid: validation.isValid,
      failures: validation.failures,
    }
  }

  private hasValidatingSubmitTransition(): boolean {
    return this.compiledForm.runtimePlan.submitTransitionIds.some(transitionId => {
      const transition = this.compiledForm.artefact.nodeRegistry.get(transitionId) as
        | SubmitTransitionASTNode
        | undefined

      return transition?.properties.validate === true
    })
  }
}
