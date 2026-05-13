import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'

/**
 * Initialize session
 */
export const initializeSession = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()

  // TODO
}
