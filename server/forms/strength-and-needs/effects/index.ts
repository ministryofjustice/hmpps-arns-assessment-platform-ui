import { buildEffectFunction, resolveInjectedEffectsType } from '@form-engine/registry/utils/buildEffect'
import { ValueExpr } from '@form-engine/form/types/expressions.type'

export interface SANAssessmentService {
  loadAssessment(assessmentId: string): Promise<any>
  save(data: any, options?: { draft?: boolean }): Promise<any>
  completeSection(section: string): Promise<any>
}

/**
 * Effects for the Strengths and Needs assessment forms
 */
export const strengthsAndNeedsEffect = {
  /**
   * Save the assessment data to the database.
   *
   * @params options - Save options
   *
   * @returns Promise resolving to the saved assessment data
   *
   * @example
   * effects: [StrengthsAndNeedsEffect.Save()]
   */
  Save: (service: SANAssessmentService) =>
    buildEffectFunction('strengthsAndNeedsEffectSave', async (context: any, options?: any) => {
      // TODO: Example, finalise later
      service.save(context.getAnswers(), options)
    }),

  /**
   * Save the assessment draft data to the data store.
   *
   * @returns Promise resolving to the saved assessment data
   *
   * @example
   * effects: [StrengthsAndNeedsEffect.SaveDraft()]
   */
  SaveDraft: (service: SANAssessmentService) =>
    buildEffectFunction('strengthsAndNeedsEffectSave', async (context: any) => {
      // TODO: Example, finalise later
      service.save(context.getAnswers())
    }),

  /**
   * Load an assessment from the database by ID.
   * Retrieves the full assessment data and stores it in context.
   *
   * @params assessmentId - The ID of the assessment to load
   *
   * @returns Promise resolving to the loaded assessment data
   *
   * @example
   * effects: [StrengthsAndNeedsEffect.LoadAssessment(Data('crn'))]
   */
  LoadAssessment: (service: SANAssessmentService) =>
    buildEffectFunction('strengthsAndNeedsEffectLoad', async (context: any, assessmentId: ValueExpr) => {
      // TODO: Example, finalise later
      const data = await service.loadAssessment(assessmentId as string)
      context.setAnswers(data)
    }),

  /**
   * Mark a section as complete.
   * Updates the section status and performs any completion logic.
   *
   * @params section - The section to mark as complete
   *
   * @returns Promise resolving when the section is marked complete
   *
   * @example
   * effects: [StrengthsAndNeedsEffect.CompleteSection('accommodation')]
   */
  CompleteSection: (service: SANAssessmentService) =>
    buildEffectFunction('strengthsAndNeedsEffectCompleteSection', async (context: any, section: string) => {
      // TODO: Example, finalise later
      await service.completeSection(section)
      context.setData(`${section}.completed`, true)
    }),
}

export const StrengthsAndNeedsEffect = resolveInjectedEffectsType(strengthsAndNeedsEffect)

// Register these in the form engine later
// registerEffects(resolveInjectedEffects(strengthsAndNeedsEffect, {}))
