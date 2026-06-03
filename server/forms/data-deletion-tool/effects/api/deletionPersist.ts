import { InternalServerError } from 'http-errors'
import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'
import { createApiClient } from './createApiClient'

export const deletionPersist = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()
  const assessmentUuid = session.answers.assessmentUuid

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment identifier is required')
  }

  const api = createApiClient(context)
  const request = session.deletionRequest

  request.dryRun = false

  const response = await api.postDataDeletionRequest(assessmentUuid, request)

  // TODO: handle response
}
