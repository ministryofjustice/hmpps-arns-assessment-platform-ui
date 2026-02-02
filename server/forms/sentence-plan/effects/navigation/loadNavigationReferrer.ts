import { SentencePlanContext } from '../types'

/**
 * Load navigation referrer from session
 *
 * Reads the referrer from session, makes it available as Data('navigationReferrer'),
 * and clears it from session.
 *
 * Call this in onLoad of pages that need to check where the user came from
 * for dynamic backlink logic.
 */
export const loadNavigationReferrer = () => async (context: SentencePlanContext) => {
  const session = context.getSession()
  const referrer: string | null = session.navigationReferrer || null

  // Make available for backlink logic
  context.setData('navigationReferrer', referrer)
}
