import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { MPoPComponents } from '@ministryofjustice/hmpps-mpop-frontend-components-lib'
import ArnsApiClient from '@ministryofjustice/hmpps-aap-sdk/dependencies/arns/ArnsApiClient'
import AssessmentPlatformApiClient from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentPlatformApiClient'
import CoordinatorApiClient from '@ministryofjustice/hmpps-aap-sdk/dependencies/coordinator/CoordinatorApiClient'
import DeliusApiClient from '@ministryofjustice/hmpps-aap-sdk/dependencies/delius/DeliusApiClient'
import HandoverApiClient from '@ministryofjustice/hmpps-aap-sdk/dependencies/handover/HandoverApiClient'
import applicationInfoSupplier from '../applicationInfo'

import { createRedisClient } from './redisClient'
import config from '../config'
import logger from '../../logger'
import AssessmentCacheStore from './assessmentCacheStore'
import PreferencesStore from './preferencesStore'
import GotenbergClient from './gotenbergClient'

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
    assessmentPlatformApiClient: new AssessmentPlatformApiClient(
      config.apis.aapApi,
      hmppsAuthClient,
      logger,
      assessmentCacheStore,
    ),
    deliusApiClient: new DeliusApiClient(config.apis.deliusApi, hmppsAuthClient, logger),
    handoverApiClient: new HandoverApiClient(config.apis.arnsHandover, hmppsAuthClient, logger),
    coordinatorApiClient: new CoordinatorApiClient(config.apis.coordinatorApi, hmppsAuthClient, logger),
    mpopComponents: new MPoPComponents(
      hmppsAuthClient,
      {
        ...config.apis.tierApi,
        supervisionPackageApiConfig: config.apis.supervisionPackageApi,
      },
      logger,
    ),
    arnsApiClient: new ArnsApiClient(config.apis.arnsApi, hmppsAuthClient, logger),
    gotenbergClient: new GotenbergClient(config.apis.gotenberg),
    assessmentCacheStore,
    preferencesStore: new PreferencesStore(),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { AuthenticationClient, AssessmentCacheStore, GotenbergClient, PreferencesStore, MPoPComponents }
