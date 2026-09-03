import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { deriveDrugCategories } from './assessment/deriveDrugCategories'
import { loadAssessment } from './assessment/loadAssessment'
import { saveCurrentStepAnswers } from './assessment/saveCurrentStepAnswers'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { setPrivacyAccepted } from './session/setPrivacyAccepted'
import { setViewAllAnswersBacklink } from './session/setViewAllAnswersBacklink'
import { StrengthsAndNeedsEffectsDeps } from './types'
import { setSectionProgress } from './assessment/setSectionProgress'
import { saveAndClearStaleAnswers } from './assessment/saveAndClearStaleAnswers'
import { addItemToCollection } from './assessment/addItemToCollection'
import { loadAnswersFromCollection } from './assessment/loadAnswersFromCollection'
import { loadItemFromCollection } from './assessment/loadItemFromCollection'
import { updateItemFromCollection } from './assessment/updateItemFromCollection'
import { removeItemFromCollection } from './assessment/removeItemFromCollection'
import { emptyCollection } from './assessment/emptyCollection'
import { setRiskOfSexualHarm } from './assessment/setRiskOfSexualHarm'

export const sanEffects = new EffectRegistry<StrengthsAndNeedsEffectsDeps>()

export const StrengthsAndNeedsEffects = {
  initializeSessionFromAccess: sanEffects.register('initializeSessionFromAccess', initializeSessionFromAccess),
  loadSessionData: sanEffects.register('loadSessionData', loadSessionData),
  setPrivacyAccepted: sanEffects.register('setPrivacyAccepted', setPrivacyAccepted),
  setViewAllAnswersBacklink: sanEffects.register('setViewAllAnswersBacklink', setViewAllAnswersBacklink),
  loadAssessment: sanEffects.register('loadAssessment', loadAssessment),
  saveCurrentStepAnswers: sanEffects.register('saveCurrentStepAnswers', saveCurrentStepAnswers),
  saveAndClearStaleAnswers: sanEffects.register('saveAndClearStaleAnswers', saveAndClearStaleAnswers),
  deriveDrugCategories: sanEffects.register('deriveDrugCategories', deriveDrugCategories),
  setSectionProgress: sanEffects.register('setSectionProgress', setSectionProgress),
  addItemToCollection: sanEffects.register('addItemToCollection', addItemToCollection),
  updateItemFromCollection: sanEffects.register('updateItemFromCollection', updateItemFromCollection),
  removeItemFromCollection: sanEffects.register('removeItemFromCollection', removeItemFromCollection),
  emptyCollection: sanEffects.register('emptyCollection', emptyCollection),
  loadItemFromCollection: sanEffects.register('loadItemFromCollection', loadItemFromCollection),
  loadAnswersFromCollection: sanEffects.register('loadAnswersFromCollection', loadAnswersFromCollection),
  setRiskOfSexualHarm: sanEffects.register('setRiskOfSexualHarm', setRiskOfSexualHarm),
}
