import { AccessContext } from '../types'

/**
 * Clear all access-related session data.
 *
 * This ensures that when a user switches between access routes (e.g., from
 * Handover/OASys to HMPPS Auth), stale session data from the previous
 * route is not carried over.
 */
export const clearAccessSession = () => (context: AccessContext) => {
  const session = context.getSession()

  delete session.handoverContext
  delete session.caseDetails
  delete session.practitionerDetails
  delete session.accessDetails
}
