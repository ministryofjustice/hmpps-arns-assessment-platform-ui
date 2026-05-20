import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'

/**
 * Clear session
 */
export const clearSession = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()

  session.answers = null
  session.currentData = null
}
