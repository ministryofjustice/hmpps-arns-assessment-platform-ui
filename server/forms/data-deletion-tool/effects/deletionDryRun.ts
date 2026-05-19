import { InternalServerError } from 'http-errors'
import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'
import { createApiClient } from './shared/createApiClient'

export const deletionDryRun = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()
  const assessmentUuid = session.answers.assessmentUuid

  context.getPostData()

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment identifier is required')
  }

  session.deletionRequest.dryRun = true

  const api = createApiClient(context)

  // api.getDataDeletionData()
}
