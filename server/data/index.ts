import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import applicationInfoSupplier from '../applicationInfo'

import { createRedisClient } from './redisClient'
import config from '../config'
import logger from '../../logger'
import AssessmentPlatformApiClient from './assessmentPlatformApiClient'
import DeliusApiClient from './deliusApiClient'
import HandoverApiClient from './handoverApiClient'
import CoordinatorApiClient from './coordinatorApiClient'
import AssessmentCacheStore from './assessmentCacheStore'
import PreferencesStore from './preferencesStore'

const applicationInfo = applicationInfoSupplier()

export const dataAccess = () => {
  const hmppsAuthClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient(), 'aap-ui-system-token') : new InMemoryTokenStore(),
  )

  const assessmentCacheStore = new AssessmentCacheStore()

  return {
    applicationInfo,
    hmppsAuthClient,
    assessmentPlatformApiClient: new AssessmentPlatformApiClient(hmppsAuthClient, assessmentCacheStore),
    deliusApiClient: new DeliusApiClient(hmppsAuthClient),
    handoverApiClient: new HandoverApiClient(hmppsAuthClient),
    coordinatorApiClient: new CoordinatorApiClient(hmppsAuthClient),
    assessmentCacheStore,
    preferencesStore: new PreferencesStore(),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export {
  AuthenticationClient,
  AssessmentCacheStore,
  AssessmentPlatformApiClient,
  HandoverApiClient,
  DeliusApiClient,
  CoordinatorApiClient,
  PreferencesStore,
}
