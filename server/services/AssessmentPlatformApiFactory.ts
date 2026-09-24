import { AuthenticationClient, InMemoryTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import type {
  AssessmentPlatformApi,
  AssessmentPlatformApiConnection,
  AssessmentPlatformApiFactory as AssessmentPlatformApiFactoryCapability,
} from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentPlatformApi.type'
import AssessmentPlatformApiClient from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentPlatformApiClient'
import logger from '../../logger'
import config from '../config'

export default class AssessmentPlatformApiFactory implements AssessmentPlatformApiFactoryCapability {
  create(connection: AssessmentPlatformApiConnection): AssessmentPlatformApi {
    const authenticationClient = new AuthenticationClient(
      {
        ...config.apis.hmppsAuth,
        url: connection.authenticationUrl,
        systemClientId: connection.clientId,
        systemClientSecret: connection.clientSecret,
      },
      logger,
      new InMemoryTokenStore(),
    )

    return new AssessmentPlatformApiClient(
      { ...config.apis.aapApi, url: connection.apiUrl },
      authenticationClient,
      logger,
    )
  }
}
