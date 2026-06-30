import { SentencePlanContext } from '../types'

/**
 * Derives the best available user context for telemetry.
 *
 * For HMPPS_AUTH users (MPoP): resolves to the HMPPS Auth role e.g. PRISON or PROBATION.
 * For OASYS users (handover): resolves to the subject's location e.g. PRISON or COMMUNITY,
 * which is a substitute for practitioner type rather than an exact match.
 */
export const getUserContext = (context: SentencePlanContext): string => {
  const user = context.getState('user')
  const session = context.getSession()

  if (user.authSource === 'HMPPS_AUTH') {
    return user.userRoles?.[0] ?? 'UNKNOWN'
  }

  return session.handoverContext?.subject.location ?? 'UNKNOWN'
}
