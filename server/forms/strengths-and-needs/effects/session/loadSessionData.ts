import { StrengthsAndNeedsContext } from '../types'

/**
 * Load session data into the data context.
 *
 * Exposes session values to Data() references so they can be used
 * in conditionals and templates:
 * - privacyAccepted: Whether the privacy screen was accepted this session
 * - caseData: Case details from session (for CaseData.Forename, person header, etc.)
 * - sessionDetails: Access details (for accessType checks, OASys redirect, etc.)
 * - accessDetails: Raw access details, available before initializeSessionFromAccess runs
 */
export const loadSessionData = () => (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()

  context.setData('privacyAccepted', session.privacyAccepted ?? false)

  if (session.caseDetails) {
    context.setData('caseData', session.caseDetails)
  }

  if (session.sessionDetails) {
    context.setData('sessionDetails', session.sessionDetails)
  }

  if (session.accessDetails) {
    context.setData('accessDetails', session.accessDetails)
  }
}
