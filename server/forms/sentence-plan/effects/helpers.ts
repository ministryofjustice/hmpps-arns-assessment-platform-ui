import { SentencePlanContext } from './types'

// A CRN is required because the ARNS needs endpoints are keyed by it. Mirrors canAccessSanContent
// in guards.ts.
export const canAccessSanInfo = (context: SentencePlanContext): boolean => {
  const assessment = context.getData('assessment')
  const session = context.getSession()
  const isSanSp = assessment && 'flags' in assessment && assessment.flags?.includes('SAN_BETA')
  const isMpop = session.sessionDetails?.accessType === 'HMPPS_AUTH'
  const isMpopAssessmentInfoEnabled = context.getData('featureFlags')?.mpopAssessmentInfoEnabled === true
  const hasCrn = Boolean(session.caseDetails?.crn)

  return Boolean(isSanSp && hasCrn && (!isMpop || isMpopAssessmentInfoEnabled))
}
