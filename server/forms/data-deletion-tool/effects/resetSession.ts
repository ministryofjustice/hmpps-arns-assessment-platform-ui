import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'

/**
 * Reset session
 */
export const resetSession = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()

  session.environment = null
  session.clientId = null
  session.clientSecret = null
  session.assessmentUuid = null
}
