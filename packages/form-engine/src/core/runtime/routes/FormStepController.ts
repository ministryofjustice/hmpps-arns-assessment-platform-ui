import createHttpError from 'http-errors'
import { performance } from 'node:perf_hooks'
import { FormInstanceDependencies } from '@form-engine/core/types/engine.type'
import { CompiledForm } from '@form-engine/core/compilation/FormCompilationFactory'
import ThunkEvaluator from '@form-engine/core/compilation/thunks/ThunkEvaluator'
import { ThunkInvocationAdapter } from '@form-engine/core/compilation/thunks/types'
import ThunkEvaluationContext, {
  JourneyReachabilityState,
  ReachabilityStep,
} from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import { SubmitTransitionASTNode } from '@form-engine/core/types/expressions.type'
import { BlockASTNode, StepASTNode } from '@form-engine/core/types/structures.type'
import { Evaluated, JourneyMetadata } from '@form-engine/core/runtime/rendering/types'
import RenderContextFactory from '@form-engine/core/runtime/rendering/RenderContextFactory'
import TransitionExecutor from '@form-engine/core/runtime/executors/TransitionExecutor'
import ContextPreparer from '@form-engine/core/runtime/executors/ContextPreparer'
import ValidationExecutor from '@form-engine/core/runtime/executors/ValidationExecutor'
import AnswerPreparer from '@form-engine/core/runtime/executors/AnswerPreparer'
import MetadataExecutor, { MetadataExecutionResult } from '@form-engine/core/runtime/executors/MetadataExecutor'
import RenderExecutor from '@form-engine/core/runtime/executors/RenderExecutor'
import ReachabilityExecutor, {
  ReachabilityExecutionResult,
} from '@form-engine/core/runtime/executors/ReachabilityExecutor'
import { ReachabilityRuntimePlan } from '@form-engine/core/compilation/ReachabilityRuntimePlanBuilder'
import { StepController } from './types'

/**
 * Handles the full request lifecycle for form steps.
 *
 * GET: access lifecycle → evaluate → render
 * POST: access lifecycle → action transitions → validation → submit transitions → render/redirect
 *
 * Access lifecycle runs onAccess transitions for each ancestor (outer → inner).
 * Any transition can halt with a redirect or error.
 */
export default class FormStepController<TRequest, TResponse> implements StepController<TRequest, TResponse> {
  private readonly contextPreparer: ContextPreparer

  private readonly transitionExecutor: TransitionExecutor

  private readonly validationExecutor: ValidationExecutor

  private readonly answerPreparer: AnswerPreparer

  private readonly metadataExecutor: MetadataExecutor

  private readonly renderExecutor: RenderExecutor

  private readonly reachabilityExecutor: ReachabilityExecutor

  constructor(
    private readonly compiledForm: CompiledForm[number],
    private readonly dependencies: FormInstanceDependencies,
    private readonly navigationMetadata: JourneyMetadata[],
    private readonly currentStepPath: string,
    private readonly reachabilityPlan?: ReachabilityRuntimePlan,
  ) {
    this.contextPreparer = new ContextPreparer()
    this.transitionExecutor = new TransitionExecutor(this.dependencies.logger)
    this.validationExecutor = new ValidationExecutor()
    this.answerPreparer = new AnswerPreparer()
    this.metadataExecutor = new MetadataExecutor()
    this.renderExecutor = new RenderExecutor()
    this.reachabilityExecutor = new ReachabilityExecutor()
  }

  async get(req: TRequest, res: TResponse): Promise<void> {
    const { evaluator, context } = this.prepareRequest(req, res)
    const plan = this.compiledForm.runtimePlan

    const accessResult = await this.transitionExecutor.executeAccessLifecycle(plan, evaluator, context)

    if (accessResult.outcome === 'redirect') {
      return this.redirect(res, req, accessResult.redirect)
    }

    if (accessResult.outcome === 'error') {
      throw createHttpError(accessResult.status, accessResult.message || 'Access denied')
    }

    if (plan.isAnswerPrepareSync) {
      this.answerPreparer.prepareSync(plan, evaluator, context)
    } else {
      await this.answerPreparer.prepare(plan, evaluator, context)
    }

    const reachabilityRedirect = await this.checkReachability(evaluator, context)

    if (reachabilityRedirect) {
      return this.redirect(res, req, reachabilityRedirect)
    }

    if (plan.isRenderSync) {
      return this.renderSync(res, req, evaluator, context)
    }

    return await this.render(res, req, evaluator, context)
  }

  async post(req: TRequest, res: TResponse): Promise<void> {
    const { evaluator, context } = this.prepareRequest(req, res)
    const plan = this.compiledForm.runtimePlan

    const accessResult = await this.transitionExecutor.executeAccessLifecycle(plan, evaluator, context)

    if (accessResult.outcome === 'redirect') {
      return this.redirect(res, req, accessResult.redirect)
    }

    if (accessResult.outcome === 'error') {
      throw createHttpError(accessResult.status, accessResult.message || 'Access denied')
    }

    if (plan.isAnswerPrepareSync) {
      this.answerPreparer.prepareSync(plan, evaluator, context)
    } else {
      await this.answerPreparer.prepare(plan, evaluator, context)
    }

    const reachabilityRedirect = await this.checkReachability(evaluator, context)

    if (reachabilityRedirect) {
      return this.redirect(res, req, reachabilityRedirect)
    }

    await this.transitionExecutor.executeActionTransitions(plan, evaluator, context)
    await this.evaluateValidationIfNeeded(evaluator, context)

    const submitResult = await this.transitionExecutor.executeSubmitTransitions(plan, evaluator, context)

    if (submitResult.outcome === 'error') {
      throw createHttpError(submitResult.status!, submitResult.message || 'Submission error')
    }

    if (submitResult.outcome === 'redirect') {
      return this.redirect(res, req, submitResult.redirect)
    }

    const renderOptions = submitResult.validated ? { showValidationFailures: true } : {}

    if (plan.isRenderSync) {
      return this.renderSync(res, req, evaluator, context, renderOptions)
    }

    return await this.render(res, req, evaluator, context, renderOptions)
  }

  private prepareRequest(req: TRequest, res: TResponse) {
    const request = this.dependencies.frameworkAdapter.toStepRequest(req)
    const response = this.dependencies.frameworkAdapter.toStepResponse(res)
    const evaluator = ThunkEvaluator.withRuntimeOverlay(this.compiledForm.artefact, this.dependencies)
    const context = this.contextPreparer.prepare(this.compiledForm.runtimePlan, evaluator, request, response)

    context.global.currentStep = this.getCurrentStep()

    return { evaluator, context }
  }

  private redirect(res: TResponse, req: TRequest, redirect: string): void {
    if (redirect.includes('://') || redirect.startsWith('/')) {
      return this.dependencies.frameworkAdapter.redirect(res, redirect)
    }

    const baseUrl = this.dependencies.frameworkAdapter.getBaseUrl(req)

    return this.dependencies.frameworkAdapter.redirect(res, `${baseUrl}/${redirect}`)
  }

  private async render(
    res: TResponse,
    req: TRequest,
    evaluator: ThunkEvaluator,
    context: ThunkEvaluationContext,
    options: { showValidationFailures?: boolean } = {},
  ): Promise<void> {
    const plan = this.compiledForm.runtimePlan

    const [metadata, blocks] = await Promise.all([
      this.metadataExecutor.execute(plan, evaluator, context),
      this.renderExecutor.execute(plan, evaluator, context),
    ])

    this.buildAndRender(res, req, metadata, blocks, context, options)
  }

  private renderSync(
    res: TResponse,
    req: TRequest,
    evaluator: ThunkEvaluator,
    context: ThunkEvaluationContext,
    options: { showValidationFailures?: boolean } = {},
  ): void {
    const plan = this.compiledForm.runtimePlan
    const metadata = this.metadataExecutor.executeSync(plan, evaluator, context)
    const blocks = this.renderExecutor.executeSync(plan, evaluator, context)

    this.buildAndRender(res, req, metadata, blocks, context, options)
  }

  private buildAndRender(
    res: TResponse,
    req: TRequest,
    metadata: MetadataExecutionResult,
    blocks: Evaluated<BlockASTNode>[],
    context: ThunkEvaluationContext,
    options: { showValidationFailures?: boolean } = {},
  ): void {
    const renderContext = RenderContextFactory.build(
      {
        step: metadata.step,
        ancestors: metadata.ancestors,
        blocks,
        answers: context.global.answers,
        data: context.global.data,
        validationFailures: this.getStepValidationFailures(context),
      },
      {
        navigationMetadata: this.navigationMetadata,
        currentStepPath: this.currentStepPath,
        showValidationFailures: options.showValidationFailures,
      },
    )

    this.dependencies.frameworkAdapter.render(renderContext, req, res)
  }

  private getStepValidationFailures(context: ThunkEvaluationContext) {
    const validation = context.global.validation

    if (validation?.stepId === this.compiledForm.runtimePlan.stepId) {
      return validation.failures
    }

    return []
  }

  private async evaluateValidationIfNeeded(
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

  /**
   * Check if the current step is reachable via the navigation graph.
   *
   * Returns the redirect target if the page is unreachable, or undefined if the
   * current step is reachable.
   */
  private async checkReachability(
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<string | undefined> {
    if (!this.reachabilityPlan) {
      return undefined
    }

    const startTime = performance.now()

    try {
      const result = await this.reachabilityExecutor.execute(
        this.reachabilityPlan,
        invoker,
        context,
        this.compiledForm.runtimePlan.stepId,
      )

      context.global.reachability = this.createReachabilityState(result)

      return this.reachabilityExecutor.resolveRedirectPath(result, this.compiledForm.runtimePlan.stepId)
    } finally {
      this.dependencies.logger.info(
        {
          durationMs: Number((performance.now() - startTime).toFixed(3)),
          path: this.currentStepPath,
          stepId: this.compiledForm.runtimePlan.stepId,
        },
        'Navigation reachability check completed',
      )
    }
  }

  private createReachabilityState(result: ReachabilityExecutionResult): JourneyReachabilityState {
    const reachableSteps = result.steps.filter(step => step.isReachable)
    const unreachableSteps = result.steps.filter(step => !step.isReachable)

    return {
      reachableSteps: reachableSteps.map(step => this.createReachabilityStep(step.path, step.code)),
      unreachableSteps: unreachableSteps.map(step => this.createReachabilityStep(step.path, step.code)),
    }
  }

  private createReachabilityStep(path: string, code?: string): ReachabilityStep {
    if (code) {
      return { path: `/${path}`, code }
    }

    return { path: `/${path}` }
  }

  private getCurrentStep(): ReachabilityStep {
    const stepNode = this.compiledForm.artefact.nodeRegistry.get(this.compiledForm.runtimePlan.stepId) as
      | StepASTNode
      | undefined

    if (stepNode?.properties.code) {
      return { path: stepNode.properties.path, code: stepNode.properties.code }
    }

    return { path: stepNode?.properties.path ?? this.currentStepPath }
  }
}
