import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export default class AssessmentPlatformApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Assessment Platform API', config.apis.aapApi, logger, authenticationClient)
  }

  // CQRS Command endpoint - for write operations
  async executeCommand<T>(request: Record<string, unknown>): Promise<T> {
    return this.post({ path: '/command', data: request }, asSystem())
  }

  // CQRS Query endpoint - for read operations
  async executeQuery<T>(request: Record<string, unknown>): Promise<T> {
    return this.post({ path: '/query', data: request }, asSystem())
  }
}
