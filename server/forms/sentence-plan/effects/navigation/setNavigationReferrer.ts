import { SentencePlanContext } from '../types'

/**
 * Set navigation referrer in the session
 *
 * Stores where the user came from so backlinks can navigate back
 * to the correct location. Similar to notification pattern.
 *
 * Example usage:
 *   SentencePlanEffects.setNavigationReferrer('plan-overview-current')
 *   SentencePlanEffects.setNavigationReferrer('update-goal-steps')
 */
export const setNavigationReferrer = () => async (context: SentencePlanContext, referrer: string) => {
  const session = context.getSession()
  session.navigationReferrer = referrer
}
