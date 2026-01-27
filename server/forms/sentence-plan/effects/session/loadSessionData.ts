import { SentencePlanContext } from '../types'

/**
 * Load session data into the data context
 *
 * This exposes session values to Data() references so they can be used
 * in conditionals and templates:
 * - session: Full session object (for privacyAccepted, accessDetails, etc.)
 * - caseData: Case details from session (for CaseData.Forename, etc.)
 * - sessionDetails: Session details (for accessType checks, etc.)
 *
 * This effect is used by:
 * - Privacy screen (to check privacyAccepted and display person's name)
 * - Other steps that need session data before loadPlan runs
 */
export const loadSessionData = () => (context: SentencePlanContext) => {
  const session = context.getSession()
  context.setData('session', session)

  // Expose caseData for CaseData.Forename and other references
  if (session.caseDetails) {
    context.setData('caseData', session.caseDetails)
  }

  // Expose sessionDetails for accessType checks
  if (session.sessionDetails) {
    context.setData('sessionDetails', session.sessionDetails)
  }

  // Expose accessDetails for privacy screen (before initializeSessionFromAccess runs)
  if (session.accessDetails) {
    context.setData('accessDetails', session.accessDetails)
  }
}
