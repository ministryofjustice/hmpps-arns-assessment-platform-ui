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
   * Uses the user's own token (not a system token) so the endpoint's limited-access-offender checks
   * run against the actual user — a 403 is an expected "cannot view this case" state, not an error.
   *
   * excludeIncomplete=false because an OASys assessment only reaches COMPLETE once the whole thing
   * is signed off, RoSH included.
   */
  async getCriminogenicNeeds(crn: string, token: string): Promise<AssessmentNeedsDto> {
    return this.get({ path: `/needs/crn/${crn}`, query: { excludeIncomplete: false } }, asUser(token))
  }

  /**
   * System/client-credentials call - OASys sessions carry no HMPPS Auth user token, so no
   * per-request LAO check is possible for this cohort. The CRN passed in must come only
   * from the handover session, never a route param. Uses the integration endpoint.
   */
  async getCriminogenicNeedsDetails(crn: string): Promise<AssessmentNeedsDetailsDto> {
    return this.get({ path: `/needs/${crn}`, query: { excludeIncomplete: false } }, asSystem())
  }
}
