import { SentencePlanContext } from '../types'
import { getNavigationReferrerFromPageHistory } from './getNavigationReferrerFromPageHistory'

/**
 * Load navigation referrer from session
 *
 * Reads the referrer from session and makes it available as Data('navigationReferrer').
 *
 * Call this in onLoad of pages that need to check where the user came from
 * for dynamic backlink logic.
 */
export const loadNavigationReferrer = () => async (context: SentencePlanContext) => {
  const pageHistory = context.getState('pageHistory')
  const referrer = getNavigationReferrerFromPageHistory(pageHistory)

  // Make available for backlink logic
  context.setData('navigationReferrer', referrer)
}
