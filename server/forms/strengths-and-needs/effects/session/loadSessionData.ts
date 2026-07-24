import { StrengthsAndNeedsContext } from '../types'

/**
 * Load session data into the data context.
 *
 * Exposes session values to Data() references so they can be used
 * in conditionals and templates:
 * - caseData: Case details from session (for CaseData.Forename, person header, etc.)
 * - sessionDetails: Access details (for accessType checks, OASys redirect, etc.)
 */
export const loadSessionData = () => (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()

  if (session.caseDetails) {
    context.setData('caseData', session.caseDetails)
  }

  if (session.sessionDetails) {
    context.setData('sessionDetails', session.sessionDetails)
  }
}
