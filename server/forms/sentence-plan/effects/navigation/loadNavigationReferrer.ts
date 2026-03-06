import { SentencePlanContext } from '../types'
import { getNavigationReferrerFromPreviousPageUrl } from './getNavigationReferrerFromPreviousPageUrl'

/**
 * Load navigation referrer from session
 *
 * Reads the referrer from session and makes it available as Data('navigationReferrer').
 *
 * Call this in onLoad of pages that need to check where the user came from
 * for dynamic backlink logic.
 */
export const loadNavigationReferrer = () => async (context: SentencePlanContext) => {
  const previousPageUrl = context.getState('previousPageUrl')
  const referrer = getNavigationReferrerFromPreviousPageUrl(previousPageUrl)

  // Make available for backlink logic
  context.setData('navigationReferrer', referrer)
}
