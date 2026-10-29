import { AccessContext, AccessSession } from '../types'

/**
 * Clear all access-related session data.
 *
 * This ensures that when a user switches between access routes (e.g., from
 * Handover/OASys to HMPPS Auth), stale session data from the previous
 * route is not carried over.
 *
 * SAN's own session state (e.g. the previous person's versions) is cleared
 * too, so every access starts SAN afresh.
 */
export const clearAccessSession = () => (context: AccessContext) => {
  const session: AccessSession & { san?: unknown } = context.getSession()

  delete session.handoverContext
  delete session.caseDetails
  delete session.practitionerDetails
  delete session.accessDetails

  delete session.san
}
