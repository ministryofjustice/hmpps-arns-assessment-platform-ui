import { SentencePlanContext } from './types'

// Requires a SAN_SP assessment (SAN_BETA flag), a CRN (the ARNS needs endpoints are keyed by
// CRN, and ~10% of OASys handovers have none), and either non-MPoP access or MPoP with the
// assessment-info feature flag enabled.
export const canAccessSanInfo = (context: SentencePlanContext): boolean => {
  const assessment = context.getData('assessment')
  const session = context.getSession()
  const isSanSp = assessment && 'flags' in assessment && assessment.flags?.includes('SAN_BETA')
  const isMpop = session.sessionDetails?.accessType === 'HMPPS_AUTH'
  const isMpopAssessmentInfoEnabled = context.getData('featureFlags')?.mpopAssessmentInfoEnabled === true
  const hasCrn = Boolean(session.caseDetails?.crn)

  return Boolean(isSanSp && hasCrn && (!isMpop || isMpopAssessmentInfoEnabled))
}
