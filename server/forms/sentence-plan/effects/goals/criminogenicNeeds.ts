import { CriminogenicNeedsData } from '../../../../interfaces/coordinator-api/entityAssessment'
import { mapArnsNeedsToCriminogenicNeeds } from '../../../../utils/arnsApiMapper'
import { mapArnsIntegrationNeedsToCriminogenicNeeds } from '../../../../utils/arnsIntegrationMapper'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * MPoP users have a user token, so their needs come from the ARNS assessment endpoint (called as
 * the user). OASys users have no user token, so theirs come from the ARNS integration endpoint
 * (system token) keyed by the handover CRN. Both map to the same shape for source-agnostic callers.
 */
export const resolveCriminogenicNeedsData = async (
  deps: SentencePlanEffectsDeps,
  context: SentencePlanContext,
  crn: string | undefined,
): Promise<CriminogenicNeedsData | null> => {
  const isMpop = context.getSession().sessionDetails?.accessType === 'HMPPS_AUTH'

  if (isMpop) {
    const token = context.getState('user')?.token
    if (!token) {
      throw new Error('Cannot load criminogenic needs for MPoP user: missing user token')
    }
    if (!crn) {
      throw new Error('Cannot load criminogenic needs for MPoP user: missing crn')
    }

    const needs = await deps.arnsApi.getCriminogenicNeeds(crn, token)
    return mapArnsNeedsToCriminogenicNeeds(needs)
  }

  // Only ever the handover-scoped CRN, never a route param, so a practitioner can only pull the
  // case OASys authorised.
  const handoverCrn = context.getSession().handoverContext?.subject?.crn
  if (!handoverCrn) {
    // Null rather than throw: a CRN-less OASys handover is expected, and callers treat null as "no data".
    return null
  }

  const needs = await deps.arnsApi.getCriminogenicNeedsDetails(handoverCrn)
  return mapArnsIntegrationNeedsToCriminogenicNeeds(needs)
}
