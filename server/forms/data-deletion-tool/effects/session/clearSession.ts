import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'

/**
 * Clear session
 */
export const clearSession = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()

  session.answers = {
    environment: session.answers.environment,
    clientId: session.answers.clientId,
    clientSecret: session.answers.clientSecret,
    assessmentUuid: session.answers.assessmentUuid,
  }

  session.currentData = null
  session.deletionRequest = null
  session.deletionResponse = null
}
