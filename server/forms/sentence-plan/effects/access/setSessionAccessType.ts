import { SentencePlanContext } from '../types'

export type AccessType = 'mpop' | 'oasys'

/**
 * Set the access type in session (MPOP or OASys)
 *
 * This determines how the user accessed the sentence plan and may affect
 * certain behaviours throughout the journey.
 */
export const setSessionAccessType = () => (context: SentencePlanContext, accessType: AccessType) => {
  const session = context.getSession()
  session.accessType = accessType
}
