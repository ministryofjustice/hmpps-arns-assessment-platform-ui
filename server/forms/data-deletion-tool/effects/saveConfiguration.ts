import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'

/**
 * Save configuration to session
 */
export const saveConfiguration = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()

  session.environment = context.getAnswer('environment') as string
  session.clientId = context.getAnswer('clientId') as string
  session.clientSecret = context.getAnswer('clientSecret') as string
  session.assessmentUuid = context.getAnswer('assessmentUuid') as string
}
