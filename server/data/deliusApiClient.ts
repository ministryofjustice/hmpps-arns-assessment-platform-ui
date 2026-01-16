import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { CaseDetails } from '../interfaces/delius-api/caseDetails'

export default class DeliusApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Delius API', config.apis.deliusApi, logger, authenticationClient)
  }

  async getCaseDetails(crn: string): Promise<CaseDetails> {
    return this.get({ path: `/case-details/${crn}` }, asSystem())
  }
}
