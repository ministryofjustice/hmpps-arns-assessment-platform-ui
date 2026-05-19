import { InternalServerError } from 'http-errors'
import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'
import { createApiClient } from './shared/createApiClient'

export const deletionPersist = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()
  const assessmentUuid = session.answers.assessmentUuid

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment identifier is required')
  }

  session.deletionRequest.dryRun = true

  const api = createApiClient(context)

  // TODO: submit and handle deletion request
}
