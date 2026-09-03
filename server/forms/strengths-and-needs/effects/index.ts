import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { deriveDrugCategories } from './assessment/deriveDrugCategories'
import { loadAssessment } from './assessment/loadAssessment'
import { loadPreviousVersions } from './assessment/loadPreviousVersions'
import { saveCurrentStepAnswers } from './assessment/saveCurrentStepAnswers'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { setPrivacyAccepted } from './session/setPrivacyAccepted'
import { setViewAllAnswersBacklink } from './session/setViewAllAnswersBacklink'
import { StrengthsAndNeedsEffectsDeps } from './types'
import { setSectionProgress } from './assessment/setSectionProgress'
import { saveAndClearStaleAnswers } from './assessment/saveAndClearStaleAnswers'
import { setRiskOfSexualHarm } from './assessment/setRiskOfSexualHarm'
import { extractModeAndVersionUuidFromUrl } from './session/extractModeAndVersionUuidFromUrl'
import { generateInitialFormUrl } from './session/generateInitialFormUrl'

export const sanEffects = new EffectRegistry<StrengthsAndNeedsEffectsDeps>()

export const StrengthsAndNeedsEffects = {
  initializeSessionFromAccess: sanEffects.register('initializeSessionFromAccess', initializeSessionFromAccess),
  loadSessionData: sanEffects.register('loadSessionData', loadSessionData),
  setPrivacyAccepted: sanEffects.register('setPrivacyAccepted', setPrivacyAccepted),
  setViewAllAnswersBacklink: sanEffects.register('setViewAllAnswersBacklink', setViewAllAnswersBacklink),
  loadAssessment: sanEffects.register('loadAssessment', loadAssessment),
  loadPreviousVersions: sanEffects.register('loadPreviousVersions', loadPreviousVersions),
  saveCurrentStepAnswers: sanEffects.register('saveCurrentStepAnswers', saveCurrentStepAnswers),
  saveAndClearStaleAnswers: sanEffects.register('saveAndClearStaleAnswers', saveAndClearStaleAnswers),
  deriveDrugCategories: sanEffects.register('deriveDrugCategories', deriveDrugCategories),
  setSectionProgress: sanEffects.register('setSectionProgress', setSectionProgress),
  setRiskOfSexualHarm: sanEffects.register('setRiskOfSexualHarm', setRiskOfSexualHarm),
  extractModeAndVersionUuidFromUrl: sanEffects.register('extractModeAndVersionUuidFromUrl', extractModeAndVersionUuidFromUrl),
  generateInitialFormUrl: sanEffects.register('generateInitialFormUrl', generateInitialFormUrl),
}
