import { InternalServerError } from 'http-errors'
import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'
import { createApiClient } from './createApiClient'
import { createDataDeletionRequest } from './createDeletionRequest'

export const deletionDryRun = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()
  const assessmentUuid = session.answers.assessmentUuid

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment identifier is required')
  }

  const api = createApiClient(context)
  const request = createDataDeletionRequest(context)

  request.dryRun = true

  const response = await api.postDataDeletionRequest(assessmentUuid, request)

  // TODO: handle response
}
