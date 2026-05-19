import { InternalServerError, NotFound } from 'http-errors'
import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'
import { createApiClient } from './shared/createApiClient'

/**
 * Load assessment data using the provided identifier
 */
export const loadAssessmentData = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()
  const assessmentUuid = session.answers.assessmentUuid

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment identifier is required')
  }

  const api = createApiClient(context)

  const data = await api.getDataDeletionData(assessmentUuid)

  if (!data) {
    throw new NotFound('Data deletion data not found')
  }

  session.currentData = data
}
