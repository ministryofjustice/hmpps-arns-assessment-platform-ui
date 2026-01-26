import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import { AccessEffectsDeps } from './types'
import { loadHandoverContext } from './handover/loadHandoverContext'
import { setCaseDetailsFromHandoverContext } from './handover/setCaseDetailsFromHandoverContext'
import { setPractitionerDetailsFromHandoverContext } from './handover/setPractitionerDetailsFromHandoverContext'
import { setAccessDetailsFromHandoverContext } from './handover/setAccessDetailsFromHandoverContext'
import { setCaseDetailsFromCrn } from './crn/setCaseDetailsFromCrn'
import { setPractitionerDetailsFromAuth } from './crn/setPractitionerDetailsFromAuth'
import { setAccessDetailsForCrn } from './crn/setAccessDetailsForCrn'
import { setTargetServiceAndRedirect } from './common/setTargetServiceAndRedirect'

/**
 * Access form effects for handling OASys/CRN authentication flows.
 * These effects populate session with case details, practitioner details,
 * and access configuration that target forms can use.
 */
export const { effects: AccessEffects, createRegistry: AccessEffectsRegistry } =
  defineEffectsWithDeps<AccessEffectsDeps>()({
    // Common effects
    setTargetServiceAndRedirect,

    // Handover flow effects
    loadHandoverContext,
    setCaseDetailsFromHandoverContext,
    setPractitionerDetailsFromHandoverContext,
    setAccessDetailsFromHandoverContext,

    // CRN flow effects
    setCaseDetailsFromCrn,
    setPractitionerDetailsFromAuth,
    setAccessDetailsForCrn,
  })
