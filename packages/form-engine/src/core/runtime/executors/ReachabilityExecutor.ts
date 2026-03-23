import { NodeId } from '@form-engine/core/types/engine.type'
import { ThunkInvocationAdapter } from '@form-engine/core/compilation/thunks/types'
import ThunkEvaluationContext from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import ValidationExecutor from '@form-engine/core/runtime/executors/ValidationExecutor'
import {
  ReachabilityRuntimePlan,
  ReachabilityStepEntry,
} from '@form-engine/core/compilation/ReachabilityRuntimePlanBuilder'

export interface ReachabilityExecutionResult {
  steps: ReachabilityStepState[]
}

export interface ReachabilityStepState {
  path: string
  code?: string
  stepId: NodeId
  isEntryPoint: boolean
  isValid: boolean
  isReachable: boolean
  forwardPath: string | undefined
  predecessorStepIds: NodeId[]
}

/**
 * ReachabilityExecutor - Builds a runtime navigation graph for a journey
 *
 * Evaluates validation state and forward navigation paths for all steps in a journey
 * to determine which steps a user can access based on their current form state.
 *
 * Navigation is scoped to steps within the same parent journey. Forward paths that
 * leave the journey (e.g., '../../overview') are resolved but don't affect
 * reachability within the journey.
 *
 * ## How it works
 * 1. For each step, runs validation to determine if the step is "complete"
 * 2. For each step, evaluates redirect outcomes from onValid.next to determine
 *    where valid submission would navigate
 * 3. Walks the graph from all entry points to compute reachability: a step is
 *    reachable if there's a chain of valid steps leading to it
 */
export default class ReachabilityExecutor {
  private readonly validationExecutor = new ValidationExecutor()

  async execute(
    plan: ReachabilityRuntimePlan,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
    targetStepId?: NodeId,
  ): Promise<ReachabilityExecutionResult> {
    const stepStates = plan.entries.map(entry => this.createStepState(entry))

    await this.computeReachability(stepStates, plan, invoker, context, targetStepId)

    return { steps: stepStates }
  }

  resolveRedirectPath(result: ReachabilityExecutionResult, currentStepId: NodeId): string | undefined {
    const currentStep = result.steps.find(step => step.stepId === currentStepId)

    if (!currentStep || currentStep.isReachable) {
      return undefined
    }

    const linearBlockerPath = this.findLinearBlockerPath(result, currentStepId)

    if (linearBlockerPath !== undefined) {
      return linearBlockerPath
    }

    const reachableEntryPoint = result.steps.find(step => step.isEntryPoint && step.isReachable)

    return reachableEntryPoint?.path ?? result.steps[0]?.path
  }

  private createStepState(entry: ReachabilityStepEntry): ReachabilityStepState {
    return {
      path: entry.path,
      code: entry.code,
      stepId: entry.stepId,
      isEntryPoint: entry.isEntryPoint,
      isValid: true,
      isReachable: false,
      forwardPath: undefined,
      predecessorStepIds: [],
    }
  }

  private async evaluateValidity(
    entry: ReachabilityStepEntry,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<boolean> {
    if (!entry.hasValidation) {
      return true
    }

    const validation = await this.validationExecutor.execute(entry.stepRuntimePlan, invoker, context)

    return validation.isValid
  }

  /**
   * Evaluate redirect outcomes in order (first-match semantics) to resolve
   * the forward navigation path.
   *
   * Each outcome's `when` predicate is evaluated against the current form state.
   * The first outcome whose condition matches (or has no condition) provides the
   * forward path. Returns undefined if no outcome matches or all fail.
   */
  private async resolveForwardPath(
    outcomeIds: NodeId[],
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
  ): Promise<string | undefined> {
    for (const outcomeId of outcomeIds) {
      // eslint-disable-next-line no-await-in-loop
      const result = await invoker.invoke(outcomeId, context)

      if (!result.error && result.value !== undefined) {
        return this.normalizePath(String(result.value))
      }
    }

    return undefined
  }

  /**
   * Compute reachability by walking the navigation graph from all entry steps.
   *
   * A step is reachable if:
   * - It is the entry point for the journey, OR
   * - A reachable, valid step has a forwardPath matching this step's path
   *
   * Entry points are determined by `isEntryPoint` on the step definition.
   * If no step is marked as an entry point, the first step is used as the seed.
   *
   * Forward paths that don't match any step in the journey are external
   * navigation and are ignored for reachability.
   */
  private async computeReachability(
    stepStates: ReachabilityStepState[],
    plan: ReachabilityRuntimePlan,
    invoker: ThunkInvocationAdapter,
    context: ThunkEvaluationContext,
    targetStepId?: NodeId,
  ): Promise<void> {
    if (stepStates.length === 0) {
      return
    }

    const entryByStepId = new Map(plan.entries.map(entry => [entry.stepId, entry]))
    const stateByPath = new Map<string, ReachabilityStepState>()
    const entrySteps = plan.entries
      .map((entry, index) => ({ entry, state: stepStates[index] }))
      .filter(({ entry }) => entry.isEntryPoint)
      .map(({ state }) => state)
    const evaluatedValidityStepIds = new Set<NodeId>()
    const evaluatedForwardPathStepIds = new Set<NodeId>()

    stepStates.forEach(state => {
      stateByPath.set(state.path, state)
    })

    const seededEntrySteps = entrySteps.length > 0 ? entrySteps : [stepStates[0]]

    seededEntrySteps.forEach(step => {
      step.isReachable = true
    })

    if (targetStepId && seededEntrySteps.some(step => step.stepId === targetStepId)) {
      return
    }

    const visited = new Set<string>()
    const queue = seededEntrySteps.map(step => step.path)

    stepStates.forEach(state => {
      const next = state.forwardPath ? stateByPath.get(state.forwardPath) : undefined

      if (next) {
        next.predecessorStepIds.push(state.stepId)
      }
    })

    while (queue.length > 0) {
      const currentPath = queue.shift()!

      if (!visited.has(currentPath)) {
        visited.add(currentPath)

        const current = stateByPath.get(currentPath)

        if (!current) {
          // eslint-disable-next-line no-continue
          continue
        }

        const entry = entryByStepId.get(current.stepId)

        if (!entry) {
          // eslint-disable-next-line no-continue
          continue
        }

        if (!evaluatedValidityStepIds.has(current.stepId)) {
          // eslint-disable-next-line no-await-in-loop
          current.isValid = await this.evaluateValidity(entry, invoker, context)
          evaluatedValidityStepIds.add(current.stepId)
        }

        const shouldEvaluateForwardPath = current.stepId !== targetStepId

        if (shouldEvaluateForwardPath && !evaluatedForwardPathStepIds.has(current.stepId)) {
          // eslint-disable-next-line no-await-in-loop
          current.forwardPath = await this.resolveForwardPath(entry.forwardOutcomeIds, invoker, context)
          evaluatedForwardPathStepIds.add(current.stepId)
        }

        const next = current.forwardPath ? stateByPath.get(current.forwardPath) : undefined

        if (next && !next.predecessorStepIds.includes(current.stepId)) {
          next.predecessorStepIds.push(current.stepId)
        }

        if (current.isValid && next && !visited.has(next.path)) {
          if (!next.isReachable) {
            next.isReachable = true
          }

          if (targetStepId && next.stepId === targetStepId) {
            return
          }

          queue.push(next.path)
        }
      }
    }
  }

  private findLinearBlockerPath(result: ReachabilityExecutionResult, currentStepId: NodeId): string | undefined {
    const stateById = new Map(result.steps.map(step => [step.stepId, step]))
    const visitedStepIds = new Set<NodeId>()
    let currentStep = stateById.get(currentStepId)

    while (currentStep) {
      if (visitedStepIds.has(currentStep.stepId)) {
        return undefined
      }

      visitedStepIds.add(currentStep.stepId)

      if (currentStep.predecessorStepIds.length !== 1) {
        return undefined
      }

      const predecessorStep = stateById.get(currentStep.predecessorStepIds[0])

      if (!predecessorStep) {
        return undefined
      }

      if (predecessorStep.isReachable && !predecessorStep.isValid) {
        return predecessorStep.path
      }

      currentStep = predecessorStep
    }

    return undefined
  }

  private normalizePath(path: string): string {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path

    return normalizedPath.split(/[?#]/)[0] ?? normalizedPath
  }
}
