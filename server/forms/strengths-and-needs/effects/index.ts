import { defineNamespacedEffectsWithDeps } from '../../shared/defineNamespacedEffectsWithDeps'
import { deriveDrugCategories } from './assessment/deriveDrugCategories'
import { loadAssessment } from './assessment/loadAssessment'
import { saveCurrentStepAnswers } from './assessment/saveCurrentStepAnswers'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { StrengthsAndNeedsEffectsDeps } from './types'

// TODO: Implement additional effects for:
// - loadSectionData: Load section answers from the assessment platform API
// - saveSectionData: Save section answers to the assessment platform API
// - setSectionComplete: Mark a section as complete
// - setSectionIncomplete: Mark a section as incomplete

export const { effects: StrengthsAndNeedsEffects, createRegistry: StrengthsAndNeedsEffectsRegistry } =
  defineNamespacedEffectsWithDeps<StrengthsAndNeedsEffectsDeps>('strengthsAndNeeds')({
    initializeSessionFromAccess,
    loadSessionData,
    loadAssessment,
    saveCurrentStepAnswers,
    deriveDrugCategories,
  })
