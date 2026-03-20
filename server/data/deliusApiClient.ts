import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { CaseDetails } from '../interfaces/delius-api/caseDetails'
import { AccessPermissions } from '../interfaces/delius-api/accessPermissions'

export default class DeliusApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Delius API', config.apis.deliusApi, logger, authenticationClient)
  }

  async getCaseDetails(crn: string): Promise<CaseDetails> {
    return this.get({ path: `/case-details/${crn}` }, asSystem())
  }

  // Used by auth middleware to enforce fine-grained access:
  // confirms whether a specific user can access a specific CRN.
  async getUserAccess(username: string, crn: string): Promise<AccessPermissions> {
    return this.get(
      {
        path: `/users/${username}/access/${crn}`,
      },
      asSystem(),
    )
  }
}
