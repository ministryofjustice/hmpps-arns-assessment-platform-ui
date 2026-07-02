import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'

/**
 * Clear deletion response data from session
 */
export const clearDeletionResponse =
  (_deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
    const session = context.getSession()

    session.deletionResponse = null
  }
