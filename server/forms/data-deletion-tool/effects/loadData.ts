import { InternalServerError, NotFound } from 'http-errors'
import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types';
import { createApiClient } from './createApiClient';

/**
 * Load assessment data using the provided identifier
 */
export const loadData = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const assessmentUuid = context.getSession().assessmentUuid

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment identifier is required')
  }

  const api = createApiClient(context)

  const data = await api.getDataDeletionData(assessmentUuid)

  if (!data) {
    throw new NotFound('Data deletion data not found')
  }

  context.setData('currentData', data)
}
