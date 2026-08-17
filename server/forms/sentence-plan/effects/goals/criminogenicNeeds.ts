import { CriminogenicNeedsData } from '../../../../interfaces/coordinator-api/entityAssessment'
import { mapHandoverToCriminogenicNeeds } from '../../../../utils/handoverApiMapper'
import { mapArnsNeedsToCriminogenicNeeds } from '../../../../utils/arnsApiMapper'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Resolves criminogenic needs from the correct source for the current user.
 *
 * MPoP users have no handover context, so their needs come from the ARNS API
 * (called with the user's own token so the endpoint's LAO checks run against them).
 * OASys users keep using the handover-supplied data. Both map to the same
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

  const handoverCriminogenicNeeds = context.getSession().handoverContext?.criminogenicNeedsData
  return mapHandoverToCriminogenicNeeds(handoverCriminogenicNeeds)
}
