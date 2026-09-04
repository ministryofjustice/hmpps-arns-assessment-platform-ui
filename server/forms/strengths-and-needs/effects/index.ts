import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { deriveDrugCategories } from './assessment/deriveDrugCategories'
import { loadAssessment } from './assessment/loadAssessment'
import { loadPreviousVersions } from './assessment/loadPreviousVersions'
import { saveCurrentStepAnswers } from './assessment/saveCurrentStepAnswers'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { setPrivacyAccepted } from './session/setPrivacyAccepted'
import { setDynamicBacklink } from './session/setDynamicBacklink'
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
import { sendAuditEvent } from './audit/sendAuditEvent'
import { extractModeAndVersionUuidFromUrl } from './session/extractModeAndVersionUuidFromUrl'
import { generateInitialFormUrl } from './session/generateInitialFormUrl'

export const sanEffects = new EffectRegistry<StrengthsAndNeedsEffectsDeps>()

export const StrengthsAndNeedsEffects = {
  initializeSessionFromAccess: sanEffects.register('initializeSessionFromAccess', initializeSessionFromAccess),
  loadSessionData: sanEffects.register('loadSessionData', loadSessionData),
  setPrivacyAccepted: sanEffects.register('setPrivacyAccepted', setPrivacyAccepted),
  setDynamicBacklink: sanEffects.register('setDynamicBacklink', setDynamicBacklink),
  loadAssessment: sanEffects.register('loadAssessment', loadAssessment),
  loadPreviousVersions: sanEffects.register('loadPreviousVersions', loadPreviousVersions),
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
  extractModeAndVersionUuidFromUrl: sanEffects.register(
    'extractModeAndVersionUuidFromUrl',
    extractModeAndVersionUuidFromUrl,
  ),
  generateInitialFormUrl: sanEffects.register('generateInitialFormUrl', generateInitialFormUrl),
  sendAuditEvent: sanEffects.register('sendAuditEvent', sendAuditEvent),
}

export { CommonAuditEvent } from '../../shared'
export { SanAuditEvent } from '../auditEvents'
