import { defineEffectFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { FunctionEvaluator } from '@ministryofjustice/hmpps-forge/core/authoring'
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

type EffectShapesFromFactories<TFactories> = {
  [K in keyof TFactories]: TFactories[K] extends (deps: infer _Deps) => infer Evaluator
    ? Evaluator extends FunctionEvaluator<unknown>
      ? Evaluator
      : never
    : never
}

const accessEffectFactories = {
  clearAccessSession,
  setTargetServiceAndRedirect,
  loadHandoverContext,
  setCaseDetailsFromHandoverContext,
  setPractitionerDetailsFromHandoverContext,
  setAccessDetailsFromHandoverContext,
  setCaseDetailsFromCrn,
  setPractitionerDetailsFromAuth,
  setAccessDetailsForCrn,
}

/**
 * Access form effects for handling OASys/CRN authentication flows.
 * These effects populate session with case details, practitioner details,
 * and access configuration that target forms can use.
 */
export const { effects: AccessEffects, implementations: AccessEffectImplementations } = defineEffectFunctions<
  EffectShapesFromFactories<typeof accessEffectFactories>,
  AccessEffectsDeps
>(accessEffectFactories)
