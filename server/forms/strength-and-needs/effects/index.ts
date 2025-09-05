import { buildEffectFunction } from '@form-engine/registry/utils/buildEffect'
import { ValueExpr } from '@form-engine/form/types/expressions.type'
import { FunctionType } from '@form-engine/form/types/enums'
import {
  createInjectableFunctions,
  resolveInjectableFunctions,
} from '@form-engine/registry/utils/createRegisterableFunction'

export interface SANAssessmentService {
  loadAssessment(assessmentId: string): Promise<any>
  save(data: any, options?: { draft?: boolean }): Promise<any>
  completeSection(section: string): Promise<any>
}

/**
 * Strengths and Needs assessment forms.
 */
export const strengthsAndNeedsEffectFactories = {
  /**
   * Save the assessment data to the database.
   *
   * @example
   * effects: [StrengthsAndNeedsEffect.Save()]
   * effects: [StrengthsAndNeedsEffect.Save({ draft: true })]
   */
  Save: (service: SANAssessmentService) =>
    buildEffectFunction('strengthsAndNeedsEffectSave', async (context: any, options?: { draft?: boolean }) => {
      await service.save(context.getAnswers(), options)
    }),

  /**
   * Save the assessment draft data to the data store.
   * Convenience method that always saves as draft.
   *
   * @example
   * effects: [StrengthsAndNeedsEffect.SaveDraft()]
   */
  SaveDraft: (service: SANAssessmentService) =>
    buildEffectFunction('strengthsAndNeedsEffectSaveDraft', async (context: any) => {
      await service.save(context.getAnswers(), { draft: true })
    }),

  /**
   * Load an assessment from the database by ID.
   * Retrieves the full assessment data and stores it in context.
   *
   * @param assessmentId - The ID of the assessment to load
   *
   * @example
   * effects: [StrengthsAndNeedsEffect.LoadAssessment(Data('crn'))]
   */
  LoadAssessment: (service: SANAssessmentService) =>
    buildEffectFunction('strengthsAndNeedsEffectLoadAssessment', async (context: any, assessmentId: ValueExpr) => {
      const data = await service.loadAssessment(assessmentId as string)
      context.setAnswers(data)
    }),

  /**
   * Mark a section as complete.
   * Updates the section status and performs any completion logic.
   *
   * @param section - The section to mark as complete
   *
   * @example
   * effects: [StrengthsAndNeedsEffect.CompleteSection('accommodation')]
   */
  CompleteSection: (service: SANAssessmentService) =>
    buildEffectFunction('strengthsAndNeedsEffectCompleteSection', async (context: any, section: string) => {
      await service.completeSection(section)
      context.setData(`${section}.completed`, true)
    }),
}

/**
 * Proxy for using effects in form configurations.
 * This allows effects to be used without needing to pass dependencies.
 *
 * @example
 * import { StrengthsAndNeedsEffect } from './effects'
 *
 * // In form configuration:
 * onLoad: [
 *   loadTransition({
 *     effects: [StrengthsAndNeedsEffect.LoadAssessment(Data('crn'))]
 *   })
 * ]
 */
export const StrengthsAndNeedsEffect = createInjectableFunctions(strengthsAndNeedsEffectFactories, FunctionType.EFFECT)

/**
 * Resolves the effect factories with actual service implementation.
 * This should be called at application initialization.
 *
 * @param service - The SANAssessmentService implementation
 * @returns Resolved effects ready for registration with the form engine
 *
 * @example
 * // At application initialization:
 * const assessmentService = new SANAssessmentService(db, logger)
 * const resolvedEffects = resolveStrengthsAndNeedsEffects(assessmentService)
 * formEngine.registerEffects(resolvedEffects)
 */
export function resolveStrengthsAndNeedsEffects(service: SANAssessmentService) {
  return resolveInjectableFunctions(strengthsAndNeedsEffectFactories, service)
}
