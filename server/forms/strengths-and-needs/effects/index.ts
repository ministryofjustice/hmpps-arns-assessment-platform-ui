import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { deriveDrugCategories } from './assessment/deriveDrugCategories'
import { loadAssessment } from './assessment/loadAssessment'
import { loadPreviousVersions } from './assessment/loadPreviousVersions'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { setPrivacyAccepted } from './session/setPrivacyAccepted'
import { setDynamicBacklink } from './session/setDynamicBacklink'
import { StrengthsAndNeedsEffectsDeps } from './types'
import { setSectionProgress } from './assessment/setSectionProgress'
import { saveCurrentStepAnswers } from './assessment/saveCurrentStepAnswers'
import { addItemToCollection } from './assessment/addItemToCollection'
import { loadAnswersFromCollection } from './assessment/loadAnswersFromCollection'
import { loadItemFromCollection } from './assessment/loadItemFromCollection'
import { updateItemFromCollection } from './assessment/updateItemFromCollection'
import { removeItemFromCollection } from './assessment/removeItemFromCollection'
import { emptyCollection } from './assessment/emptyCollection'
import { setRiskOfSexualHarm } from './assessment/setRiskOfSexualHarm'
import { sendAuditEvent } from './audit/sendAuditEvent'
import { saveCurrentAccommodationStepAnswers } from './assessment/saveCurrentAccommodationStepAnswers'
import { extractModeAndVersionUuidFromUrl } from './session/extractModeAndVersionUuidFromUrl'
import { setUserSubmitted } from './assessment/setUserSubmitted'
import { extractModeAndVersionUuidFromHandoverContext } from './session/extractModeAndVersionUuidFromHandoverContext'

export const sanEffects = new EffectRegistry<StrengthsAndNeedsEffectsDeps>()

export const StrengthsAndNeedsEffects = {
  initializeSessionFromAccess: sanEffects.register('initializeSessionFromAccess', initializeSessionFromAccess),
  loadSessionData: sanEffects.register('loadSessionData', loadSessionData),
  setPrivacyAccepted: sanEffects.register('setPrivacyAccepted', setPrivacyAccepted),
  setDynamicBacklink: sanEffects.register('setDynamicBacklink', setDynamicBacklink),
  loadAssessment: sanEffects.register('loadAssessment', loadAssessment),
  loadPreviousVersions: sanEffects.register('loadPreviousVersions', loadPreviousVersions),
  saveCurrentStepAnswers: sanEffects.register('saveCurrentStepAnswers', saveCurrentStepAnswers),
  deriveDrugCategories: sanEffects.register('deriveDrugCategories', deriveDrugCategories),
  setSectionProgress: sanEffects.register('setSectionProgress', setSectionProgress),
  addItemToCollection: sanEffects.register('addItemToCollection', addItemToCollection),
  updateItemFromCollection: sanEffects.register('updateItemFromCollection', updateItemFromCollection),
  removeItemFromCollection: sanEffects.register('removeItemFromCollection', removeItemFromCollection),
  emptyCollection: sanEffects.register('emptyCollection', emptyCollection),
  loadItemFromCollection: sanEffects.register('loadItemFromCollection', loadItemFromCollection),
  loadAnswersFromCollection: sanEffects.register('loadAnswersFromCollection', loadAnswersFromCollection),
  setRiskOfSexualHarm: sanEffects.register('setRiskOfSexualHarm', setRiskOfSexualHarm),
  setUserSubmitted: sanEffects.register('setUserSubmitted', setUserSubmitted),
  extractModeAndVersionUuidFromHandoverContext: sanEffects.register(
    'extractModeAndVersionUuidFromHandoverContext',
    extractModeAndVersionUuidFromHandoverContext,
  ),
  extractModeAndVersionUuidFromUrl: sanEffects.register(
    'extractModeAndVersionUuidFromUrl',
    extractModeAndVersionUuidFromUrl,
  ),
  sendAuditEvent: sanEffects.register('sendAuditEvent', sendAuditEvent),
  saveCurrentAccommodationStepAnswers: sanEffects.register(
    'saveCurrentAccommodationStepAnswers',
    saveCurrentAccommodationStepAnswers,
  ),
}

export { CommonAuditEvent } from '../../shared'
export { SanAuditEvent } from '../auditEvents'
