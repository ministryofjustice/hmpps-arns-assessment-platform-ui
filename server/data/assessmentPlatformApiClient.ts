import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { CommandsRequest, QueriesRequest } from '../interfaces/aap-api/request'
import { CommandsResponse, QueriesResponse } from '../interfaces/aap-api/response'

export default class AssessmentPlatformApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Assessment Platform API', config.apis.aapApi, logger, authenticationClient)
  }

  // CQRS Command endpoint - for write operations
  async executeCommands(request: CommandsRequest): Promise<CommandsResponse> {
    return this.post({ path: '/command', data: request as unknown as Record<string, unknown>}, asSystem())
  }

  // CQRS Query endpoint - for read operations
  async executeQueries(request: QueriesRequest): Promise<QueriesResponse> {
    return this.post({ path: '/query', data: request as unknown as Record<string, unknown> }, asSystem())
  }
}
