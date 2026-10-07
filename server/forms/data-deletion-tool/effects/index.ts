import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from './types'
import { loadAssessmentData } from './api/loadAssessmentData'
import { deletionDryRun } from './api/deletionDryRun'
import { deletionPersist } from './api/deletionPersist'
import { clearSession } from './session/clearSession'
import { saveAnswers } from './session/saveAnswers'
import { loadAnswers } from './session/loadAnswers'
import { createDeletionRequest } from './session/createDeletionRequest'
import { clearDeletionResponse } from './session/clearDeletionResponse'

export const dataDeletionToolEffectRegistry = new EffectRegistry<DataDeletionToolEffectsDeps>()

export const DataDeletionToolEffects = {
  // Session
  clearSession: dataDeletionToolEffectRegistry.register(clearSession),
  loadAnswers: dataDeletionToolEffectRegistry.register(loadAnswers),
  saveAnswers: dataDeletionToolEffectRegistry.register(saveAnswers),
  createDeletionRequest: dataDeletionToolEffectRegistry.register(createDeletionRequest),
  clearDeletionResponse: dataDeletionToolEffectRegistry.register(clearDeletionResponse),

  // API
  loadAssessmentData: dataDeletionToolEffectRegistry.register(loadAssessmentData),
  deletionDryRun: dataDeletionToolEffectRegistry.register(deletionDryRun),
  deletionPersist: dataDeletionToolEffectRegistry.register(deletionPersist),
}
