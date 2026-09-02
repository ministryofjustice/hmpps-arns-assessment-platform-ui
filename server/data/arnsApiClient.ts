import { RestClient, asSystem, asUser } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { AssessmentNeedsDto } from '../interfaces/arns-api/assessmentNeeds'
import { AssessmentNeedsDetailsDto } from '../interfaces/arns-api/assessmentNeedsDetails'

export default class ArnsApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('ARNS API', config.apis.arnsApi, logger, authenticationClient)
  }

  /**
   * Called as the user so the endpoint's limited-access-offender checks run against them; a 403 is
   * an expected "cannot view this case" state, not an error. excludeIncomplete is false because an
   * OASys assessment only reaches COMPLETE once the whole thing (RoSH included) is signed off.
   */
  async getCriminogenicNeeds(crn: string, token: string): Promise<AssessmentNeedsDto> {
    return this.get({ path: `/needs/crn/${crn}`, query: { excludeIncomplete: false } }, asUser(token))
  }

  /**
   * Called with a system token because OASys sessions carry no user token; the integration endpoint
   * runs no per-request LAO check, so the crn must come from the handover session, never a route param.
   */
  async getCriminogenicNeedsDetails(crn: string): Promise<AssessmentNeedsDetailsDto> {
    return this.get({ path: `/needs/${crn}`, query: { excludeIncomplete: false } }, asSystem())
  }
}
