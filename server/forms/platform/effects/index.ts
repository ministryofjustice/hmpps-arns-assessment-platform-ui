import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import { loadPrivacyScreenSessionData } from './loadPrivacyScreenSessionData'
import { sendPrivacyScreenAuditEvent } from './sendPrivacyScreenAuditEvent'
import { setPrivacyAccepted } from './setPrivacyAccepted'
import { PlatformEffectsDeps } from './types'

export const { effects: PlatformEffects, createRegistry: PlatformEffectsRegistry } =
  defineEffectsWithDeps<PlatformEffectsDeps>()({
    loadPrivacyScreenSessionData,
    setPrivacyAccepted,
    sendPrivacyScreenAuditEvent,
  })
