import { RestClient, asSystem, type ApiConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'
import type { CaseDetails } from './DeliusCaseDetails.type'
import type { AccessPermissions } from './DeliusAccessPermissions.type'

export default class DeliusApiClient extends RestClient {
  constructor(apiConfig: ApiConfig, authenticationClient: AuthenticationClient, logger: Logger | Console) {
    super('Delius API', apiConfig, logger, authenticationClient)
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
