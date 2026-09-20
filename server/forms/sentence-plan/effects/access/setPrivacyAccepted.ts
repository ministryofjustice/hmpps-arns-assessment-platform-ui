import { SentencePlanContext } from '../types'

/**
 * Set privacy accepted flag in session
 *
 * Called when user confirms they have read the privacy notice
 * and ticks the checkbox on the privacy screen.
 */
export const setPrivacyAccepted = () => (context: SentencePlanContext) => {
  const session = context.getSession()
  session.privacyAccepted = true
}
