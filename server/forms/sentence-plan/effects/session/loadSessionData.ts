import { SentencePlanContext } from '../types'

/**
 * Load session data into the data context
 *
 * This exposes session values (like privacyAccepted) to Data() references
 * so they can be used in conditionals and templates.
 */
export const loadSessionData = () => (context: SentencePlanContext) => {
  const session = context.getSession()
  context.setData('session', session)
}
