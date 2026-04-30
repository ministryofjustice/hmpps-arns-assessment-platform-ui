import { defineEffectFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { FunctionEvaluator } from '@ministryofjustice/hmpps-forge/core/authoring'
import { deriveDrugCategories } from './assessment/deriveDrugCategories'
import { loadAssessment } from './assessment/loadAssessment'
import { saveCurrentStepAnswers } from './assessment/saveCurrentStepAnswers'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { StrengthsAndNeedsEffectsDeps } from './types'

type EffectShapesFromFactories<TFactories> = {
  [K in keyof TFactories]: TFactories[K] extends (deps: infer _Deps) => infer Evaluator
    ? Evaluator extends FunctionEvaluator<unknown>
      ? Evaluator
      : never
    : never
}

const strengthsAndNeedsEffectFactories = {
  initializeSessionFromAccess,
  loadSessionData,
  loadAssessment,
  saveCurrentStepAnswers,
  deriveDrugCategories,
}

// TODO: Implement additional effects for:
// - loadSectionData: Load section answers from the assessment platform API
// - saveSectionData: Save section answers to the assessment platform API
// - setSectionComplete: Mark a section as complete
// - setSectionIncomplete: Mark a section as incomplete

export const { effects: StrengthsAndNeedsEffects, implementations: StrengthsAndNeedsEffectImplementations } =
  defineEffectFunctions<
    EffectShapesFromFactories<typeof strengthsAndNeedsEffectFactories>,
    StrengthsAndNeedsEffectsDeps
  >(strengthsAndNeedsEffectFactories)
