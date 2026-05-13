import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import { DataDeletionToolEffectsDeps } from './types'
import { loadData } from './loadData'
import { initializeSession } from './initializeSession';

export const { effects: DataDeletionToolEffects, createRegistry: createDataDeletionToolEffectsRegistry } =
  defineEffectsWithDeps<DataDeletionToolEffectsDeps>()({
    // Session
    initializeSession,

    // Data
    loadData,
  })
