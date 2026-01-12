import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { OasysCreateRequest, OasysCreateResponse } from '../interfaces/coordinator-api/oasysCreate'

export default class CoordinatorApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Coordinator API', config.apis.coordinatorApi, logger, authenticationClient)
  }

  /**
   * Create an OASys association
   * Links an OASys assessment PK to ARNS entities (SAN, Sentence Plan)
   *
   * @param request - OASys assessment details and user info
   * @returns Created entity IDs and versions
   * @throws 409 if association already exists for the OASys Assessment PK
   */
  async createOasysAssociation(request: OasysCreateRequest): Promise<OasysCreateResponse> {
    return this.post(
      {
        path: '/oasys/create',
        data: { ...request },
      },
      asSystem(),
    )
  }
}
