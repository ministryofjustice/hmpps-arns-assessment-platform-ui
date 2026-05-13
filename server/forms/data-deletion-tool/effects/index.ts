import { DataDeletionToolEffectsDeps } from './types'
import { defineNamespacedEffectsWithDeps } from '../../shared/defineNamespacedEffectsWithDeps'
import { resetSession } from './resetSession'
import { loadData } from './loadData'
import { saveConfiguration } from './saveConfiguration';

export const {
  effects: DataDeletionToolEffects,
  implementations: DataDeletionToolEffectImplementations
} = defineNamespacedEffectsWithDeps<DataDeletionToolEffectsDeps>('dataDeletionTool')({
  // Session
  resetSession,
  saveConfiguration,

  // Data
  loadData,
})
