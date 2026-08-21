import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { AssessmentNeedsDto } from '../interfaces/arns-api/assessmentNeeds'

export default class ArnsApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('ARNS API', config.apis.arnsApi, logger, authenticationClient)
  }

  /**
   * Uses the user's own token (not a system token) so the endpoint's limited-access-offender checks
   * run against the actual user — a 403 is an expected "cannot view this case" state, not an error.
   *
   * excludeIncomplete=false because an OASys assessment only reaches COMPLETE once the whole thing
   * is signed off, RoSH included.
   */
  async getCriminogenicNeeds(crn: string, token: string): Promise<AssessmentNeedsDto> {
    return this.get({ path: `/needs/crn/${crn}`, query: { excludeIncomplete: false } }, asUser(token))
  }
}
