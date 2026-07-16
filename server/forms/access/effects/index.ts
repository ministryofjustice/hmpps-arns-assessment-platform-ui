import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { loadHandoverContext } from './handover/loadHandoverContext'
import { setCaseDetailsFromHandoverContext } from './handover/setCaseDetailsFromHandoverContext'
import { setPractitionerDetailsFromHandoverContext } from './handover/setPractitionerDetailsFromHandoverContext'
import { setAccessDetailsFromHandoverContext } from './handover/setAccessDetailsFromHandoverContext'
import { setCaseDetailsFromCrn } from './crn/setCaseDetailsFromCrn'
import { setPractitionerDetailsFromAuth } from './crn/setPractitionerDetailsFromAuth'
import { setAccessDetailsForCrn } from './crn/setAccessDetailsForCrn'
import { clearAccessSession } from './common/clearAccessSession'
import { setTargetServiceAndRedirect } from './common/setTargetServiceAndRedirect'
import { AccessEffectsDeps } from './types'

export const accessEffectRegistry = new EffectRegistry<AccessEffectsDeps>()

/**
 * Access form effects for handling OASys/CRN authentication flows.
 * These effects populate session with case details, practitioner details,
 * and access configuration that target forms can use.
 */
export const AccessEffects = {
  clearAccessSession: accessEffectRegistry.register(clearAccessSession),
  setTargetServiceAndRedirect: accessEffectRegistry.register(setTargetServiceAndRedirect),
  loadHandoverContext: accessEffectRegistry.register(loadHandoverContext),
  setCaseDetailsFromHandoverContext: accessEffectRegistry.register(setCaseDetailsFromHandoverContext),
  setPractitionerDetailsFromHandoverContext: accessEffectRegistry.register(setPractitionerDetailsFromHandoverContext),
  setAccessDetailsFromHandoverContext: accessEffectRegistry.register(setAccessDetailsFromHandoverContext),
  setCaseDetailsFromCrn: accessEffectRegistry.register(setCaseDetailsFromCrn),
  setPractitionerDetailsFromAuth: accessEffectRegistry.register(setPractitionerDetailsFromAuth),
  setAccessDetailsForCrn: accessEffectRegistry.register(setAccessDetailsForCrn),
}
