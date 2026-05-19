import { DataDeletionToolEffectsDeps } from './types'
import { defineNamespacedEffectsWithDeps } from '../../shared/defineNamespacedEffectsWithDeps'
import { clearSession } from './clearSession'
import { loadAssessmentData } from './loadAssessmentData'
import { saveAnswers } from './saveAnswers';
import { loadAnswers } from './loadAnswers';
import { deletionDryRun } from './deletionDryRun';
import { deletionPersist } from './deletionPersist';
import { saveEvents } from './saveEvents';
import { saveTimeline } from './saveTimeline';

export const {
  effects: DataDeletionToolEffects,
  implementations: DataDeletionToolEffectImplementations
} = defineNamespacedEffectsWithDeps<DataDeletionToolEffectsDeps>('dataDeletionTool')({
  // Session
  clearSession,
  loadAnswers,
  saveAnswers,
  saveEvents,
  saveTimeline,

  // Assessment Data
  loadAssessmentData,
  deletionDryRun,
  deletionPersist,
})
