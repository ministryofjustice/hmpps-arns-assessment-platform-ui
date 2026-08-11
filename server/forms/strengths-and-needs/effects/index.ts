import { defineEffectFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { FunctionEvaluator } from '@ministryofjustice/hmpps-forge/core/authoring'
import { deriveDrugCategories } from './assessment/deriveDrugCategories'
import { loadAssessment } from './assessment/loadAssessment'
import { saveCurrentStepAnswers } from './assessment/saveCurrentStepAnswers'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { setPrivacyAccepted } from './session/setPrivacyAccepted'
import { StrengthsAndNeedsEffectsDeps } from './types'
import { setSectionProgress } from './assessment/setSectionProgress'
import { saveAndClearStaleAnswers } from './assessment/saveAndClearStaleAnswers'
import { setRiskOfSexualHarm } from './assessment/setRiskOfSexualHarm'

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
  setPrivacyAccepted,
  loadAssessment,
  saveCurrentStepAnswers,
  saveAndClearStaleAnswers,
  deriveDrugCategories,
  setSectionProgress,
  setRiskOfSexualHarm,
}

export const { effects: StrengthsAndNeedsEffects, implementations: StrengthsAndNeedsEffectImplementations } =
  defineEffectFunctions<
    EffectShapesFromFactories<typeof strengthsAndNeedsEffectFactories>,
    StrengthsAndNeedsEffectsDeps
  >(strengthsAndNeedsEffectFactories)
