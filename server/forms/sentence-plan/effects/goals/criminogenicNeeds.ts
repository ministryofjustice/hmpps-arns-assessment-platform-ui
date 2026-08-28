import { CriminogenicNeedsData } from '../../../../interfaces/coordinator-api/entityAssessment'
import { mapArnsNeedsToCriminogenicNeeds } from '../../../../utils/arnsApiMapper'
import { mapArnsIntegrationNeedsToCriminogenicNeeds } from '../../../../utils/arnsIntegrationMapper'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Resolves criminogenic needs from the correct source for the current user.
 *
 * MPoP users log in with their own token, so their needs come from the ARNS assessment
 * endpoint (called as the user, so its limited-access-offender checks run against them).
 * OASys users have no user token, so their needs come from the ARNS integration endpoint
 * (called with a system token) keyed by the handover-supplied CRN. Both map to the same
 * CriminogenicNeedsData shape, so callers stay source-agnostic.
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

  // The CRN must come from the handover session, never a route param, so a practitioner can only
  // pull the case OASys authorised.
  const handoverCrn = context.getSession().handoverContext?.subject?.crn
  if (!handoverCrn) {
    // ~10% of OASys users have no CRN; the assessment-info eligibility guard hides the About page
    // for them. Return null defensively so callers stay on the "no data" path.
    return null
  }

  const needs = await deps.arnsApi.getCriminogenicNeedsDetails(handoverCrn)
  return mapArnsIntegrationNeedsToCriminogenicNeeds(needs)
}
