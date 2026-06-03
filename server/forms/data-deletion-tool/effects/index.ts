import { DataDeletionToolEffectsDeps } from './types'
import { defineNamespacedEffectsWithDeps } from '../../shared/defineNamespacedEffectsWithDeps'
import { loadAssessmentData } from './api/loadAssessmentData'
import { deletionDryRun } from './api/deletionDryRun'
import { deletionPersist } from './api/deletionPersist'
import { clearSession } from './session/clearSession'
import { saveAnswers } from './session/saveAnswers'
import { loadAnswers } from './session/loadAnswers'
import { createDeletionRequest } from './session/createDeletionRequest';

export const {
  effects: DataDeletionToolEffects,
  implementations: DataDeletionToolEffectImplementations
} = defineNamespacedEffectsWithDeps<DataDeletionToolEffectsDeps>('dataDeletionTool')({
  // Session
  clearSession,
  loadAnswers,
  saveAnswers,
  createDeletionRequest,

  // API
  loadAssessmentData,
  deletionDryRun,
  deletionPersist,
})
