import { InternalServerError } from 'http-errors'
import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'
import { createApiClient } from './createApiClient'

export const deletionPersist = (_deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()
  const assessmentUuid = session.answers.assessmentUuid

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment identifier is required')
  }

  const api = createApiClient(context)
  const request = session.deletionRequest

  request.dryRun = false
  session.deletionResponse = await api.postDataDeletionRequest(assessmentUuid, request)
}
