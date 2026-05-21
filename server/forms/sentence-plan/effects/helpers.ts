import { SentencePlanContext } from './types'

// Requires both a SAN_SP assessment (SAN_BETA flag) AND non-MPoP access,
// because MPoP users cannot reach the SAN data APIs needed to populate this content.
export const canAccessSanContent = (context: SentencePlanContext): boolean => {
  const assessment = context.getData('assessment')
  const sessionDetails = context.getSession().sessionDetails
  const isSanSp = assessment && 'flags' in assessment && assessment.flags?.includes('SAN_BETA')
  const isMpop = sessionDetails?.accessType === 'HMPPS_AUTH'

  return Boolean(isSanSp && !isMpop)
}
